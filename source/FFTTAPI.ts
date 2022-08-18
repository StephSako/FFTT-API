import { ApiRequest } from "./controller/ApiRequest";
import { Partie } from "./model/Partie";
import crypto from "crypto";
import { Organisme } from "./model/Organisme";
import { ClubFactory } from "./Service/ClubFactory.service";
import { Club } from "./model/Club";
import { ClubDetails } from "./model/ClubDetails";
import { Joueur } from "./model/Joueur";
import { JoueurClassementDetails } from "./model/JoueurClassementDetails";
import { Classement } from "./model/Classement";
import { Historique } from "./model/Historique";
import { UnvalidatedPartie } from "./model/UnvalidatedPartie";
import { Equipe } from "./model/Equipe";
import { EquipePoule } from "./model/EquipePoule";
import { Rencontre } from "./model/Rencontre/Rencontre";
import { VirtualPoints } from "./model/VirtualPoints";
import { PointCalculator } from "./Service/PointCalculator.service";
import { Utils } from "./Service/Utils.service";
import { RencontreDetails } from "./model/Rencontre/RencontreDetails";
import { RencontreDetailsFactory } from "./Service/RencontreDetailsFactory.service";
import { Actualite } from "./model/Actualite";
import { OrganismeRaw } from "./model/Raw/OrganismeRaw.interface";
import { ClubDetailsRaw } from "./model/Raw/ClubDetailsRaw.interface";
import { JoueurRaw } from "./model/Raw/JoueurRaw.interface";
import { ClassementRaw } from "./model/Raw/ClassementRaw.interface";
import { HistoriqueRaw } from "./model/Raw/HistoriqueRaw.interface";
import { EquipeRaw } from "./model/Raw/EquipeRaw.interface";
import { EquipePouleRaw } from "./model/Raw/EquipePouleRaw.interface";
import { PartieRaw } from "./model/Raw/PartieRaw.interface";
import { RencontreRaw } from "./model/Raw/RencontreRaw.interface";
import { ParamsEquipe } from "./model/ParamsEquipe.interface";
import { UnvalidatedPartieRaw } from "./model/Raw/ValidatedPartieRaw.interface";
import { ResponseData } from "./model/ResponseData.interface";
import { InvalidCredidentials } from "./Exception/InvalidCredidentials";
import { ClubNotFoundException } from "./Exception/ClubNotFoundException";
import { JoueurNotFound } from "./Exception/JoueurNotFound";
import { NoFFTTResponseException } from "./Exception/NoFFTTResponseException";
import { InvalidLienRencontre } from "./Exception/InvalidLienRencontre";
import { DynamicObj } from "./model/DynamicObj.interface";
import { InvalidURIParametersException } from "./Exception/InvalidURIParametersException";
import removeAccents from 'remove-accents';
import { ClubRaw } from "./model/Raw/Clubraw.interface";
import { DivisionRaw } from "./model/Raw/DivisionRaw.interface";
import { Division } from "./model/Division";

// TODO Number() dans les constructeurs
export class FFTTAPI
{
    private id;
    private password;
    private apiRequest;

    // Premier jour de Juillet comptabilisation de la saison
    private PREMIER_JOUR_SAISON = 9;

    /**
     * Dates de publication des matches (on part du principe qu'il n'y aura pas de matches officiels le 30 et 31 Décembre et que la publication aura lieu le 1er Janvier ...)
     * mois => jour
     **/
    private DATES_PUBLICATION: DynamicObj = {
        1: 1,
        2: 3,
        3: 4,
        4: 6,
        5: 4,
        6: 10,
        7: this.PREMIER_JOUR_SAISON,
        10: 4,
        11: 3
    };

    public constructor(id: string, password: string)
    {
        this.id = id;
        this.password = crypto.createHash('md5').update(password).digest("hex");
        this.apiRequest = new ApiRequest(this.password, this.id);
    }

    // public initialize()
    // {
    //     let time = Date.now();
    //     let timeCrypted = crypto.createHmac("sha1", this.password).update(time.toString()).digest('hex');
    //     let uri = `https://apiv2.fftt.com/mobile/pxml/xml_initialisation.php?
    //         serie=${this.id}
    //         &tm=${time}
    //         &tmc=${timeCrypted}
    //         &id=${this.id}`;

    //     this.apiRequest.send(uri).then(r => {
    //         let response = this.apiRequest.send(uri);
    //         return response;
    //     }).catch(e => {
    //         if (e.status === 401){
    //             throw new InvalidCredidentials();
    //         }
    //         throw e;
    //     })
    // }

    /**
     * @param string type
     * @return Organisme[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getOrganismes(type: string = "Z"): Promise<Organisme[]>
    {
        if (!['Z', 'L', 'D'].includes(type)) {
            type = 'L';
        }

        return this.apiRequest.get('xml_organisme',
        {
            type: type,
        }).then((result: ResponseData) => {
            let dataOrganismes: OrganismeRaw[] = result.organisme;

            let organismes: Organisme[] = [];
            dataOrganismes.forEach((organisme: OrganismeRaw) => {
                organismes.push(new Organisme(
                    organisme.libelle,
                    Number(organisme.id),
                    organisme.code,
                    Number(organisme.idPere)
                ));
            })
    
            return organismes;
        })
    }

    // TODO Faire la liste des divisions

    /**
     * @param int departementId
     * @return Club[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getClubsByDepartement(departementId: number): Promise<Club[] | Club>
    {
        return this.apiRequest.get('xml_club_dep2',
        {
            dep: departementId,
        }).then((result: ResponseData) => {
            let clubData: ClubRaw[] = result.club;
            let clubFactory = new ClubFactory();
            return clubFactory.createClubFromArray(clubData);
        })
    }

    /**
     * @param string name
     * @return Club[]
     */
    // TODO faire pour tous les paramètres possibles
    public getClubsByName(name: string): Promise<Club[] | Club>
    {
        return this.apiRequest.get('xml_club_b',
        {
            ville: name,
        }).then((result: ResponseData) => {
            let clubData: ClubRaw[] = Utils.wrappedArrayIfUnique(result.club);
            let clubFactory = new ClubFactory();
            return clubFactory.createClubFromArray(clubData);
        }).catch(_e => [])
    }

    /**
     * @param string clubId
     * @return ClubDetails
     * @throws ClubNotFoundException
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getClubDetails(clubId: string): Promise<ClubDetails>
    {
        return this.apiRequest.get('xml_club_detail',
        {
            club: clubId,
        }).then((result: ResponseData) => {
            let clubData: ClubDetailsRaw = result.club;
    
            if (!clubData.numero) {
                throw new ClubNotFoundException(clubId);
            }
            return new ClubDetails(
                Number(clubData.numero),
                clubData.nom,
                !clubData.nomsalle ? null : clubData.nomsalle,
                !clubData.adressesalle1 ? null : clubData.adressesalle1,
                !clubData.adressesalle2 ? null : clubData.adressesalle2,
                !clubData.adressesalle3 ? null : clubData.adressesalle3,
                !clubData.codepsalle ? null : clubData.codepsalle,
                !clubData.villesalle ? null : clubData.villesalle,
                !clubData.web ? null : clubData.web,
                !clubData.nomcor ? null : clubData.nomcor,
                !clubData.prenomcor ? null : clubData.prenomcor,
                !clubData.mailcor ? null : clubData.mailcor,
                !clubData.telcor ? null : clubData.telcor,
                !clubData.latitude ? null : Number(clubData.latitude),
                !clubData.longitude ? null : Number(clubData.longitude)
            );
        })
    }

    /**
     * @param string clubId
     * @return Joueur[]
     * @throws ClubNotFoundException
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     */
    // TODO Ajouter les autres paramètres
    public getJoueursByClub(clubId: string): Promise<Joueur[]>
    {
        return this.apiRequest.get('xml_liste_joueur_o',
        {
            // club: clubId,
            prenom: 'alexis',
            nom: 'lebrun'
        }).then((result : ResponseData) => {
            let joueursResult: JoueurRaw[]  = result.joueur;
            let joueurs: Joueur[] = [];
    
            joueursResult.forEach((joueur: JoueurRaw) => {
                let joueurTmp: Joueur = new Joueur(
                    joueur.licence,
                    joueur.club,
                    joueur.nclub,
                    joueur.nom,
                    joueur.prenom,
                    Number(joueur.points),
                    joueur.sexe === 'M',
                    null,
                    joueur.place ? Number(joueur.place) : null,
                    joueur.echelon ?? null
                );
                delete joueurTmp.classementOfficiel; // Le classement officiel du joueur n'est pas fourni pour cette route
                joueurs.push(joueurTmp);
            })
            return joueurs;
        }).catch(_e => {
            throw new ClubNotFoundException(clubId)
        })
    }


    /**
     * @param string nom
     * @param string prenom
     * @return Joueur[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getJoueursByNom(nom: string, prenom: string = ""): Promise<Joueur[]>
    {
        return this.apiRequest.get('xml_liste_joueur',
        {
            nom: removeAccents(nom).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0'),
            prenom: removeAccents(prenom).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0'),
        }).then((result: ResponseData) => {
            let arrayJoueurs: JoueurRaw[] = Utils.wrappedArrayIfUnique(result.joueur);
            let joueurs: Joueur[] = [];
    
            // TODO Revoir cette partie
            if (arrayJoueurs) {
                arrayJoueurs.forEach((joueur: JoueurRaw) => {
                    let joueurTmp = new Joueur(
                        joueur.licence,
                        joueur.club,
                        joueur.nclub,
                        joueur.nom,
                        joueur.prenom,
                        null,
                        null,
                        joueur.clast,
                        null,
                        null
                    );
                    delete joueurTmp.points; // Les champs sexe, echelon, place, points ne sont pas fournis pour cette route
                    delete joueurTmp.echelon;
                    delete joueurTmp.isHomme;
                    delete joueurTmp.points;
                    delete joueurTmp.place;
                    joueurs.push(joueurTmp);
                })
            }
            return joueurs;
        })
    }

    /**
     * @param string licenceId
     * @return JoueurDetails
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws JoueurNotFound
     */
    public getJoueurDetailsByLicence(licenceId: string): Promise<JoueurClassementDetails>
    {
        return this.apiRequest.get('xml_licence_b',
        {
            licence: licenceId
        }).then((result: ResponseData) => {
            // TODO Creer une interface JoueurClassementDetailsRaw
            let joueurResult: any = result;
    
            if (!joueurResult.hasOwnProperty('licence')) throw new JoueurNotFound(licenceId);
            else joueurResult = joueurResult.licence;
    
            let joueurDetails: JoueurClassementDetails = new JoueurClassementDetails(
                Number(joueurResult.idlicence),
                licenceId,
                joueurResult.nom,
                joueurResult.prenom,
                joueurResult.numclub,
                joueurResult.nomclub,
                joueurResult.sexe === 'M' ? true : false,
                joueurResult.cat,
                joueurResult.initm ? Number(joueurResult.initm) : Number(joueurResult.point),
                Number(joueurResult.point),
                joueurResult.pointm ? Number(joueurResult.pointm) : Number(joueurResult.point),
                joueurResult.apointm ? Number(joueurResult.apointm) : Number(joueurResult.point),
                joueurResult.ja ?? null,
                joueurResult.arb ?? null,
                joueurResult.tech ?? null,
                joueurResult.mutation ?? null,
                joueurResult.natio ?? null,
                joueurResult.echelon ?? null,
                joueurResult.place ? Number(joueurResult.place) : null,
                joueurResult.type ?? null,
                joueurResult.certif ?? null
            );
            return joueurDetails;
        }).catch(_e /*: NoFFTTResponseException*/ => {
            throw new JoueurNotFound(licenceId);
        })
    }

    /**
     * @param string licenceId
     * @return Classement
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws JoueurNotFound
     */
    public getClassementJoueurByLicence(licence: string): Promise<Classement>
    {
        return this.apiRequest.get('xml_joueur',
        {
            licence: licence
        }).then((result: ResponseData) => {
            let joueurDetails: ClassementRaw = result.joueur;
    
            return new Classement(
                joueurDetails.point,
                joueurDetails.apoint,
                joueurDetails.clast,
                Number(joueurDetails.clnat),
                Number(joueurDetails.rangreg),
                Number(joueurDetails.rangdep),
                Number(joueurDetails.valcla),
                Number(joueurDetails.valinit),
                joueurDetails.licence,
                joueurDetails.nom,
                joueurDetails.prenom,
                joueurDetails.club,
                joueurDetails.nclub,
                joueurDetails.natio ?? null,
                Number(joueurDetails.clglob),
                Number(joueurDetails.aclglob),
                joueurDetails.categ,
                joueurDetails.clpro,
            );
        }).catch(_e => {
            throw new JoueurNotFound(licence);
        })
    }

     public getDivisionsByEpreuve(type: string, idEpreuve: number, idOrganisme: number): Promise<Division[]>
     {
         return this.apiRequest.get('xml_division',
         {
            type: type,
            epreuve: idEpreuve, // 'E' = Equipe, 'I' = Individuelle
            organisme: idOrganisme
         }).then((result: ResponseData) => {
             let divisionsData: DivisionRaw[] = result.division ?? [];
             let divisions: Division[] = [];

             divisionsData.forEach((division: DivisionRaw) => {
                divisions.push(new Division(
                     Number(division.iddivision),
                     division.libelle
                 ));
             })
             return divisions;
         })
     }

    /**
     * @param string licenceId
     * @return Historique[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws JoueurNotFound
     */
    public getHistoriqueJoueurByLicence(licenceId: string): Promise<Historique[]>
    {
        return this.apiRequest.get('xml_histo_classement',
        {
            numlic: licenceId
        }).then((result: ResponseData) => {
            let classementsData: HistoriqueRaw[] = Utils.wrappedArrayIfUnique(result.histo);
            let classements: Historique[] = [];
    
            classementsData.forEach((classement: HistoriqueRaw) => {
                let splited = classement.saison.split(' ');
                let historique = new Historique(
                    Number(splited[1]),
                    Number(splited[3]),
                    Number(classement.phase),
                    Number(classement.point),
                    classement.echelon ? classement.echelon : null,
                    classement.place ? Number(classement.point) : null
                );
                classements.push(historique);
            })
            return classements;
        }).catch (_e/*: NoFFTTResponseException*/ => {
            throw new JoueurNotFound(licenceId);
        })
    }

    /**
     * @param string joueurId
     * @return Partie[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     */
    // TODO Les classe VO
    public getPartiesJoueurByLicence(joueurId: string): Promise<Partie[]>
    {
        return this.apiRequest.get('xml_partie_mysql',
        {
            licence: joueurId,
        }).then((result: ResponseData) => {
            let partiesData: PartieRaw[] = result.partie ? Utils.wrappedArrayIfUnique(result.partie) : [];
            let parties: Partie[] = [];

            partiesData.forEach((partie: PartieRaw) => {
                let nom: string, prenom: string;
                [nom, prenom] = Utils.returnNomPrenom(partie.advnompre);
                parties.push(new Partie(
                    partie.vd === "V" ? true : false,
                    partie.numjourn ? Number(partie.numjourn) : null,
                    Utils.createDateFromFormat(partie.date),
                    Number(partie.pointres),
                    Number(partie.coefchamp),
                    partie.advlic,
                    partie.advsexe === 'M' ? true : false,
                    nom,
                    prenom,
                    Number(partie.advclaof),
                    partie.licence,
                    Number(partie.idpartie),
                    partie.codechamp
                ));
            })
    
            return parties;
        }).catch(e/*: NoFFTTResponseException)*/ => {
            return [];
        })
    }

    // /**
    //  * Détermine si la date d'un match est hors de la plage des dates définissant les matches comme validés/comptabilisés
    //  */
    // public isNouveauMoisVirtuel(date: Date): boolean {
    //     try {
    //         let mois: number = date.getMonth() + 1;
    //         let annee: number = date.getFullYear();

    //         while (!this.DATES_PUBLICATION.hasOwnProperty(mois)) {
    //             if (mois == 12) {
    //                 mois = 1;
    //                 annee++;
    //             } else mois++;
    //         }
    //         return date.getTime() >= (new Date(`${annee}/${mois}/${this.DATES_PUBLICATION[mois]}`)).getTime();
    //     } catch (e) {
    //         return false;
    //     }
    // }

    // /**
    //  * @param string joueurId
    //  * @return UnvalidatedPartie[]
    //  * @throws InvalidURIParametersException
    //  * @throws URIPartNotValidException
    //  */
    // public getUnvalidatedPartiesJoueurByLicence(joueurId: string): UnvalidatedPartie[]
    // {
    //     let validatedParties: Partie[] = this.getPartiesJoueurByLicence(joueurId);
    //     let allParties: any;
    //     try {
    //         allParties = this.apiRequest.get('xml_partie',
    //         {
    //             numlic: joueurId
    //         }).partie ?? [];
    //     } catch (e: NoFFTTResponseException) {
    //         allParties = [];
    //     }

    //     let result: UnvalidatedPartie[] = [];
    //     try {
    //         allParties.forEach((partie: UnvalidatedPartieRaw) => {
    //             if (partie.forfait === "0") {
    //                 let nom: string, prenom: string;
    //                 [nom, prenom] = Utils.returnNomPrenom(partie.nom);

    //                 let found = validatedParties.filter((validatedPartie: Partie) => {
    //                     let datePartie = Utils.createDateFromFormat(partie.date);
                        
    //                     return partie.date === validatedPartie.date.format("d/m/Y")
    //                         /** Si le nom du joueur correspond bien */
    //                         && Utils.removeAccentLowerCaseRegex(nom) === Utils.removeAccentLowerCaseRegex(validatedPartie.adversaireNom)
    //                         /** Si le prénom du joueur correspond bien */
    //                         && (
    //                             Utils.removeAccentLowerCaseRegex(validatedPartie.adversairePrenom).match('/' . Utils.removeAccentLowerCaseRegex(prenom) . '.*/') ||
    //                             Utils.removeAccentLowerCaseRegex(prenom).includes(Utils.removeAccentLowerCaseRegex(validatedPartie.adversairePrenom))
    //                         )
    //                         /** Si le coefficient est renseigné */
    //                         && validatedPartie.coefficient === Number(partie.coefchamp)
    //                         /** Si le joueur n'est pas absent */
    //                         && !prenom.includes('Absent') && !nom.includes('Absent')
    //                         /** Si la partie a été réalisée durant le mois dernier ou durant le mois actuel */
    //                         && !(
    //                             validatedPartie.pointsObtenus === 0.0
    //                             && (
    //                                 (datePartie.getMonth() + 1 === (new Date()).getMonth() + 1
    //                                     && datePartie.getFullYear() === (new Date()).getFullYear())
    //                                 || (`${datePartie.getMonth() + 1}/${datePartie.getFullYear()}`) === `${date('n', strtotime('-1 month'))}/${date('Y', strtotime('-1 month'))}`
    //                             )
    //                         );
    //                 }).length;

    //                 if (found === 0) {
    //                     result.push(new UnvalidatedPartie(
    //                         partie.epreuve,
    //                         partie.idpartie,
    //                         Number(partie.coefchamp),
    //                         partie.victoire === "V",
    //                         false,
    //                         Utils.createDateFromFormat(partie.date),
    //                         nom,
    //                         prenom,
    //                         Utils.formatPoints(partie.classement)
    //                     ));
    //                 }
    //             }
    //         })
    //         return result;
    //     } catch (e) {
    //         return [];
    //     }
    // }

    // /**
    //  * @param string joueurId
    //  * @return VirtualPoints Objet contenant les points gagnés/perdus et le classement virtuel du joueur
    //  */
    // public getJoueurVirtualPoints(joueurId: string): VirtualPoints
    // {
    //     let pointCalculator = new PointCalculator();

    //     try {
    //         let classement = this.getClassementJoueurByLicence(joueurId);
    //         let virtualMonthlyPointsWon = 0.0;
    //         let virtualMonthlyPoints = 0.0;
    //         let latestMonth: number | null = null;
    //         let monthPoints = Utils.round(classement.points);
    //         let unvalidatedParties = this.getUnvalidatedPartiesJoueurByLicence(joueurId);

    //         // usort(unvalidatedParties, (UnvalidatedPartie a, UnvalidatedPartie b) {
    //         //     return a.getDate() >= b.getDate();
    //         // });

    //         unvalidatedParties.forEach((unvalidatedParty: UnvalidatedPartie) => {
    //             if (!latestMonth) {
    //                 latestMonth = unvalidatedParty.date.getMonth() + 1;
    //             } else {
    //                 if (latestMonth != (unvalidatedParty.date.getMonth() + 1) && this.isNouveauMoisVirtuel(unvalidatedParty.date)) {
    //                     monthPoints = Utils.round(classement.points + virtualMonthlyPointsWon);
    //                     latestMonth = unvalidatedParty.date.getMonth() + 1;
    //                 }
    //             }

    //             let coeff: number = unvalidatedParty.coefficientChampionnat;

    //             if (!unvalidatedParty.isForfait) {
    //                 let adversairePoints: number = unvalidatedParty.adversaireClassement;

    //                 try {
    //                     let availableJoueurs = this.getJoueursByNom(unvalidatedParty.adversaireNom, unvalidatedParty.adversairePrenom);
    //                     availableJoueurs.forEach((availableJoueur: any) => {
    //                         if (Utils.round((unvalidatedParty.adversaireClassement / 100)) == availableJoueur.points) {
    //                             let classementJoueur: Classement = this.getClassementJoueurByLicence(availableJoueur.licence);
    //                             adversairePoints = Utils.round(classementJoueur.points);
    //                             break;
    //                         }
    //                     })
    //                 } catch (e) {
    //                     if (e instanceof NoFFTTResponseException || e instanceof InvalidURIParametersException) {
    //                         adversairePoints = unvalidatedParty.adversaireClassement;
    //                      }
    //                 }

    //                 let points: number = unvalidatedParty.isVictoire
    //                     ? pointCalculator.getPointVictory(monthPoints, Number(adversairePoints))
    //                     : pointCalculator.getPointDefeat(monthPoints, Number(adversairePoints));
    //                 virtualMonthlyPointsWon += points * coeff;
    //             }
    //         })

    //         virtualMonthlyPoints = monthPoints + virtualMonthlyPointsWon;
    //         return new VirtualPoints(
    //             virtualMonthlyPointsWon,
    //             virtualMonthlyPoints,
    //             virtualMonthlyPoints - classement.pointsInitials
    //         );
    //     } catch (/*JoueurNotFound*/ e) {
    //         return new VirtualPoints(0.0, this.getJoueurDetailsByLicence(joueurId).pointsLicence, 0.0);
    //     }
    // }

    // /**
    //  * @param string joueurId
    //  * @return number points mensuels gagnés ou perdus en fonction des points mensuels de l'adversaire
    //  */
    // public getVirtualPoints(joueurId: string): number {
    //     return this.getJoueurVirtualPoints(joueurId).monthlyPointsWon;
    // }

    /**
     * @param string clubId
     * @param string|null type
     * @return Equipe[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getEquipesByClub(clubId: string, type: string | null = null): Promise<Equipe[]>
    {
        let params: ParamsEquipe = {
            numclu: clubId
        };

        if (type) params.type = type;

        return this.apiRequest.get('xml_equipe', params).then((result: ResponseData) => {
            let equipesData: EquipeRaw[] = Utils.wrappedArrayIfUnique(result.equipe) ?? [];
            let equipes: Equipe[] = [];

            equipesData.forEach((dataEquipe: EquipeRaw) => {
                equipes.push(new Equipe(
                    dataEquipe.libequipe,
                    dataEquipe.libdivision,
                    dataEquipe.liendivision,
                    Number(dataEquipe.idequipe),
                    Number(dataEquipe.idepr),
                    dataEquipe.libepr,
                ));
            })
            return equipes;
        })
    }

    // /**
    //  * @param string lienDivision
    //  * @return EquipePoule[]
    //  * @throws Exception\InvalidURIParametersException
    //  * @throws Exception\URIPartNotValidException
    //  * @throws NoFFTTResponseException
    //  */

    // // TODO Faire pour différentes 'action' possibles
    // public getClassementPouleByLienDivision(lienDivision: string): EquipePoule[]
    // {
    //     let data: EquipePouleRaw[] = this.apiRequest.get('xml_result_equ', { action: 'classement' }, lienDivision).classement;
    //     let result: EquipePoule[] = [];
    //     let lastClassment = 0;
    //     data.forEach((equipePouleData: EquipePouleRaw) => {

    //         if (typeof equipePouleData.equipe !== 'string') {
    //             break;
    //         }

    //         result.push(new EquipePoule(
    //             equipePouleData.clt === '-' ? lastClassment : Number(equipePouleData.clt),
    //             equipePouleData.equipe,
    //             Number(equipePouleData.joue),
    //             Number(equipePouleData.pts),
    //             equipePouleData.numero,
    //             Number(equipePouleData.totvic),
    //             Number(equipePouleData.totdef),
    //             Number(equipePouleData.idequipe),
    //             equipePouleData.idclub
    //         ));
    //         lastClassment = equipePouleData.clt === '-' ? lastClassment : Number(equipePouleData.clt);
    //     })
    //     return result;
    // }

    // /**
    //  * @param string lienDivision
    //  * @return Rencontre[]
    //  * @throws Exception\InvalidURIParametersException
    //  * @throws Exception\URIPartNotValidException
    //  * @throws NoFFTTResponseException
    //  */
    // public getRencontrePouleByLienDivision(lienDivision: string): Rencontre[]
    // {
    //     let data = this.apiRequest.get('xml_result_equ', {}, lienDivision).tour;

    //     let result: Rencontre[] = [];
    //     data.forEach((dataRencontre: RencontreRaw) => {
    //         let equipeA = dataRencontre.equa;
    //         let equipeB = dataRencontre.equb;

    //         result.push(new Rencontre(
    //             dataRencontre.libelle,
    //             !equipeA ? '': equipeA,
    //             !equipeB ? '': equipeB,
    //             Number(dataRencontre.scorea),
    //             Number(dataRencontre.scoreb),
    //             dataRencontre.lien,
    //             Utils.createDateFromFormat(dataRencontre.dateprevue),
    //             dataRencontre.datereelle ? null : Utils.createDateFromFormat(dataRencontre.datereelle)
    //         ));
    //     })
    //     return result;
    // }


    // /**
    //  * @param Equipe equipe
    //  * @return Rencontre[]
    //  * @throws Exception\InvalidURIParametersException
    //  * @throws Exception\URIPartNotValidException
    //  * @throws NoFFTTResponseException
    //  */
    // public getProchainesRencontresEquipe(equipe: Equipe): Rencontre[]
    // {
    //     let nomEquipe = Utils.extractNomEquipe(equipe);
    //     let rencontres = this.getRencontrePouleByLienDivision(equipe.lienDivision);

    //     let prochainesRencontres: Rencontre[] = [];
    //     rencontres.forEach((rencontre: Rencontre) => {
    //         if (!rencontre.dateReelle && rencontre.nomEquipeA === nomEquipe || rencontre.nomEquipeB === nomEquipe) {
    //             prochainesRencontres.push(rencontre);
    //         }
    //     })
    //     return prochainesRencontres;
    // }

    // /**
    //  * @param Equipe equipe
    //  * @return ClubDetails|null
    //  * @throws ClubNotFoundException
    //  * @throws Exception\InvalidURIParametersException
    //  * @throws Exception\URIPartNotValidException
    //  * @throws NoFFTTResponseException
    //  */
    // public getClubEquipe(equipe: Equipe): ClubDetails | null
    // {
    //     let nomEquipe = Utils.extractClub(equipe);
    //     let club: Club[] = this.getClubsByName(nomEquipe);

    //     return club.length === 1 ? this.getClubDetails(club[0].numero) : null;
    // }

    // /**
    //  * @param string lienRencontre
    //  * @param string clubEquipeA
    //  * @param string clubEquipeB
    //  * @return RencontreDetails
    //  * @throws Exception\InvalidURIParametersException
    //  * @throws Exception\URIPartNotValidException
    //  * @throws InvalidLienRencontre
    //  * @throws NoFFTTResponseException
    //  */
    // public getDetailsRencontreByLien(lienRencontre: string, clubEquipeA: string = "", clubEquipeB: string = ""): RencontreDetails
    // {
    //     let data: ResponseData = this.apiRequest.get('xml_chp_renc', {}, lienRencontre);
        
    //     if (!(Utils.isset(data.resultat) && Utils.isset(data.joueur) && Utils.isset(data.partie))) {
    //         throw new InvalidLienRencontre(lienRencontre);
    //     }

    //     let factory = new RencontreDetailsFactory(this);
    //     return factory.createFromArray(data, clubEquipeA, clubEquipeB);
    // }

    /**
     * @return Actualite[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getActualites(): Promise<Actualite[]>
    {
        return this.apiRequest.get('xml_new_actu').then((data: ResponseData) => {
            let actualites = Utils.wrappedArrayIfUnique(data.news);
        
            let result: Actualite[] = [];
            actualites.forEach((dataActualite: Actualite) => {
                result.push(new Actualite(
                    new Date(dataActualite.date),
                    dataActualite.titre,
                    dataActualite.description,
                    dataActualite.url,
                    dataActualite.photo,
                    dataActualite.categorie
                ));
            })
            console.log(result);
            return result;
        })
    }
}