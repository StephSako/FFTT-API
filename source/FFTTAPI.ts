import { ApiRequest } from "./ApiRequest";
import { Partie } from "./Model/Partie";
import crypto from "crypto";
import { Organisme } from "./Model/Organisme";
import { ClubFactory } from "./Service/ClubFactory.service";
import { Club } from "./Model/Club";
import { ClubDetails } from "./Model/ClubDetails";
import { Joueur } from "./Model/Joueur";
import { JoueurClassementDetails } from "./Model/JoueurClassementDetails";
import { Classement } from "./Model/Classement";
import { Historique } from "./Model/Historique";
import { UnvalidatedPartie } from "./Model/UnvalidatedPartie";
import { Equipe } from "./Model/Equipe";
import { ClassementResultEquipe } from "./Model/ClassementResultEquipe";
import { Rencontre } from "./Model/Rencontre/Rencontre";
import { VirtualPoints } from "./Model/VirtualPoints";
import { PointCalculator } from "./Service/PointCalculator.service";
import { Utils } from "./Service/Utils.service";
import { RencontreDetails } from "./Model/Rencontre/RencontreDetails";
import { RencontreDetailsFactory } from "./Service/RencontreDetailsFactory.service";
import { Actualite } from "./Model/Actualite";
import { OrganismeRaw } from "./Model/Raw/OrganismeRaw.interface";
import { ClubDetailsRaw } from "./Model/Raw/ClubDetailsRaw.interface";
import { JoueurRaw } from "./Model/Raw/JoueurRaw.interface";
import { ClassementRaw } from "./Model/Raw/ClassementRaw.interface";
import { HistoriqueRaw } from "./Model/Raw/HistoriqueRaw.interface";
import { EquipeRaw } from "./Model/Raw/EquipeRaw.interface";
import { ClassementResultEquipeRaw } from "./Model/Raw/ClassementResultEquipeRaw.interface";
import { PartieRaw } from "./Model/Raw/PartieRaw.interface";
import { RencontreRaw } from "./Model/Raw/RencontreRaw.interface";
import { ParamsEquipe } from "./Model/ParamsEquipe.interface";
import { UnvalidatedPartieRaw } from "./Model/Raw/ValidatedPartieRaw.interface";
import { InvalidCredidentials } from "./Exception/InvalidCredidentials";
import { ClubNotFoundException } from "./Exception/ClubNotFoundException";
import { JoueurNotFound } from "./Exception/JoueurNotFound";
import { NoFFTTResponseException } from "./Exception/NoFFTTResponseException";
import { InvalidLienRencontre } from "./Exception/InvalidLienRencontre";
import { DynamicObj } from "./Model/DynamicObj.interface";
import { InvalidURIParametersException } from "./Exception/InvalidURIParametersException";
import removeAccents from 'remove-accents';
import { ClubRaw } from "./Model/Raw/ClubRaw.interface";
import { DivisionRaw } from "./Model/Raw/DivisionRaw.interface";
import { Division } from "./Model/Division";
import { ParamsPoule } from "./Model/ParamsPoule.interface";
import { PouleResultEquipe } from "./Model/PouleResultEquipe";
import { PouleResultEquipeRaw } from "./Model/Raw/PouleResultEquipeRaw.interface";
import { TourResultEquipeRaw } from "./Model/Raw/TourResultEquipeRaw.interface";
import { TourResultEquipe } from "./Model/TourResultEquipe";
import { RencontreDetailsRaw } from "./Model/Raw/RencontreDetailsRaw.interface";
import { ActualiteRaw } from "./Model/Raw/ActualiteRaw.interface";

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

    public initialize(): Promise<any>
    {
        let time = Date.now();
        let timeCrypted = crypto.createHmac("sha1", this.password).update(time.toString()).digest('hex')
        let uri = `https://apiv2.fftt.com/mobile/pxml/xml_initialisation.php?serie=${this.id}&tm=${time}&tmc=${timeCrypted}&id=${this.id}`;

        return this.apiRequest.send(uri).then(r => r)
            .catch(e => {
                if (e.response.status === 401){
                    throw new InvalidCredidentials();
                }
                throw e;
            })
    }

    /**
     * @param string type (F = Fédération, Z = Zone, L=Ligue, D=Département)
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
        }).then((result: any) => {
            let dataOrganismes: OrganismeRaw[] = result.organisme;
            let organismes: Organisme[] = [];

            dataOrganismes.forEach((organisme: OrganismeRaw) => { // TODO Problème si un seul organismes listé / USe wrappedArrayIfUnique
                organismes.push(new Organisme(
                    organisme.libelle,
                    organisme.id,
                    organisme.code,
                    organisme.idPere
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
        }).then((result: any) => {
            let clubData: ClubRaw[] = result.club;
            return ClubFactory.createClubFromArray(clubData);
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
        }).then((result: any) => {
            let clubData: ClubRaw[] = Utils.wrappedArrayIfUnique(result.club);
            return ClubFactory.createClubFromArray(clubData);
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
        }).then((result: any) => {
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
            club: clubId
        }).then((result : any) => {
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
            console.info(_e.message);
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
        }).then((result: any) => {
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
        }).then((result: any) => {
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
        }).then((result: any) => {
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
         }).then((result: any) => {
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
        }).then((result: any) => {
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
    public getPartiesJoueurByLicence(joueurId: string): Promise<Partie[]>
    {
        return this.apiRequest.get('xml_partie_mysql',
        {
            licence: joueurId,
        }).then((result: any) => {
            let partiesData: PartieRaw[] = result.partie ? Utils.wrappedArrayIfUnique(result.partie) : [];
            let parties: Partie[] = [];

            partiesData.forEach((partie: PartieRaw) => {
                let nom: string, prenom: string;
                [nom, prenom] = Utils.returnNomPrenom(partie.advnompre);
                parties.push(new Partie(
                    partie.vd === "V" ? true : false,
                    partie.numjourn ? Number(partie.numjourn) : null,
                    Utils.createDate(partie.date),
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

    /**
     * Détermine si la date d'un match est hors de la plage des dates définissant les matches comme validés/comptabilisés
     */
    public isNouveauMoisVirtuel(date: Date): boolean {
        try {
            let mois: number = date.getMonth() + 1;
            let annee: number = date.getFullYear();

            while (!this.DATES_PUBLICATION.hasOwnProperty(mois)) {
                if (mois == 12) {
                    mois = 1;
                    annee++;
                } else mois++;
            }
            return date.getTime() >= (new Date(`${annee}/${mois}/${this.DATES_PUBLICATION[mois]}`)).getTime();
        } catch (e) {
            return false;
        }
    }

    /**
     * @param string joueurId
     * @return UnvalidatedPartie[]
     * @throws InvalidURIParametersException
     * @throws URIPartNotValidException
     */
    public async getUnvalidatedPartiesJoueurByLicence(joueurId: string): Promise<UnvalidatedPartie[]>
    {
        return this.apiRequest.get('xml_partie',
        {
            numlic: joueurId
        }).then(async (result: any) => {
            let validatedParties: Partie[] = await this.getPartiesJoueurByLicence(joueurId);
            let allParties: any;
            try {
                allParties = result.partie ? result.partie : [];
            } catch (e/*: NoFFTTResponseException*/) {
                allParties = [];
            }
    
            let unvalidatedParties: UnvalidatedPartie[] = [];
            try {
                allParties.forEach((partie: UnvalidatedPartieRaw) => {
                    if (partie.forfait === "0") {
                        let nom: string, prenom: string;
                        [nom, prenom] = Utils.returnNomPrenom(partie.nom);
    
                        let found = validatedParties.filter((validatedPartie: Partie) => {
                            let datePartie = Utils.createDate(partie.date);
                            
                            return partie.date === Utils.createStringDateToFormat(validatedPartie.date)
                                /** Si le nom du joueur correspond bien */
                                && Utils.removeAccentLowerCaseRegex(nom) === Utils.removeAccentLowerCaseRegex(validatedPartie.adversaireNom)
                                /** Si le prénom du joueur correspond bien */
                                && (
                                    Utils.removeAccentLowerCaseRegex(validatedPartie.adversairePrenom).match(new RegExp(Utils.removeAccentLowerCaseRegex(prenom) + '.*')) ||
                                    Utils.removeAccentLowerCaseRegex(prenom).includes(Utils.removeAccentLowerCaseRegex(validatedPartie.adversairePrenom))
                                )
                                /** Si le coefficient est renseigné */
                                && validatedPartie.coefficient === Number(partie.coefchamp)
                                /** Si le joueur n'est pas absent */
                                && !prenom.includes('Absent') && !nom.includes('Absent')
                                /** Si la partie a été réalisée durant le mois dernier ou durant le mois actuel */
                                && !(
                                    validatedPartie.pointsObtenus === 0.0
                                    && (
                                        (datePartie.getMonth() + 1 === (new Date()).getMonth() + 1
                                            && datePartie.getFullYear() === (new Date()).getFullYear())
                                        || (`${datePartie.getMonth() + 1}/${datePartie.getFullYear()}`) === `${Utils.getPreviousMonthsMonth()}/${Utils.getPreviousMonthsYear()}`
                                    )
                                );
                        }).length;
    
                        if (found === 0) {
                            unvalidatedParties.push(new UnvalidatedPartie(
                                partie.epreuve,
                                partie.idpartie,
                                Number(partie.coefchamp),
                                partie.victoire === "V",
                                false,
                                Utils.createDate(partie.date),
                                nom,
                                prenom,
                                Utils.formatPoints(partie.classement)
                            ));
                        }
                    }
                })
                return unvalidatedParties;
            } catch (e) {
                return [];
            }
        }).catch(e/*: NoFFTTResponseException*/ => {
            return [];
        })
    }

    /**
     * @param string joueurId
     * @return VirtualPoints Objet contenant les points gagnés/perdus et le classement virtuel du joueur
     */
    public async getJoueurVirtualPoints(joueurId: string): Promise<VirtualPoints>
    {
        try {
            let classement = await this.getClassementJoueurByLicence(joueurId);
            let virtualMonthlyPointsWon = 0.0;
            let virtualMonthlyPoints = 0.0;
            let latestMonth: number | null = null;
            let monthPoints = Utils.round(classement.points);
            let unvalidatedParties = await this.getUnvalidatedPartiesJoueurByLicence(joueurId);

            // usort(unvalidatedParties, (UnvalidatedPartie a, UnvalidatedPartie b) {
            //     return a.getDate() >= b.getDate();
            // });

            unvalidatedParties.forEach(async (unvalidatedParty: UnvalidatedPartie) => {
                if (!latestMonth) {
                    latestMonth = unvalidatedParty.date.getMonth() + 1;
                } else {
                    if (latestMonth != (unvalidatedParty.date.getMonth() + 1) && this.isNouveauMoisVirtuel(unvalidatedParty.date)) {
                        monthPoints = Utils.round(classement.points + virtualMonthlyPointsWon);
                        latestMonth = unvalidatedParty.date.getMonth() + 1;
                    }
                }

                let coeff: number = unvalidatedParty.coefficientChampionnat;

                if (!unvalidatedParty.isForfait) {
                    let adversairePoints: number = unvalidatedParty.adversaireClassement;

                    try {
                        let availableJoueurs: Joueur[] = await this.getJoueursByNom(unvalidatedParty.adversaireNom, unvalidatedParty.adversairePrenom);
                        
                        for (const availableJoueur of availableJoueurs) {
                            if (Utils.round((unvalidatedParty.adversaireClassement / 100)) == availableJoueur.points) {
                                let classementJoueur: Classement = await this.getClassementJoueurByLicence(availableJoueur.licence);
                                adversairePoints = Utils.round(classementJoueur.points);
                                break;
                            }
                        }
                    } catch (e) {
                        if (e instanceof NoFFTTResponseException || e instanceof InvalidURIParametersException) {
                            adversairePoints = unvalidatedParty.adversaireClassement;
                         }
                    }

                    let points: number = unvalidatedParty.isVictoire
                        ? PointCalculator.getPointVictory(monthPoints, Number(adversairePoints))
                        : PointCalculator.getPointDefeat(monthPoints, Number(adversairePoints));
                    virtualMonthlyPointsWon += points * coeff;
                }
            })

            virtualMonthlyPoints = monthPoints + virtualMonthlyPointsWon;
            return new VirtualPoints(
                virtualMonthlyPointsWon,
                virtualMonthlyPoints,
                virtualMonthlyPoints - classement.pointsInitials
            );
        } catch (/*JoueurNotFound*/ e) {
            return new VirtualPoints(0.0, (await this.getJoueurDetailsByLicence(joueurId)).pointsLicence, 0.0);
        }
    }

    /**
     * @param string joueurId
     * @return number Points mensuels gagnés/perdus
     */
    public getVirtualPoints(joueurId: string): Promise<number> {
        return this.getJoueurVirtualPoints(joueurId).then((pointsVirtuels: VirtualPoints) => {
            return pointsVirtuels.monthlyPointsWon;
        });
    }

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

        return this.apiRequest.get('xml_equipe', params).then((result: any) => {
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

    /**
     * @param string lienDivision
     * @return EquipePoule[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */

    // TODO Faire pour différentes 'action' possibles
    public getClassementPouleByLienDivision(d1: number, action: string | null, cx_poule?: number | null, lienDivision?: string | null)
    : Promise<ClassementResultEquipe[] | PouleResultEquipe | TourResultEquipe[]>
    {
        let params: ParamsPoule = {
            D1: d1
        }
        if (action) params.action = action;
        if (cx_poule) params.cx_poule = cx_poule;

        return this.apiRequest.get('xml_result_equ', params, lienDivision)
            .then((result: any) => {
                switch(action) { 
                    case 'classement': {
                        let resultData: ClassementResultEquipeRaw[] = result.classement;

                        let classement: ClassementResultEquipe[] = [];
                        let lastClassment: number = 0;
    
                        resultData.forEach((equipePouleData: ClassementResultEquipeRaw) => {
            
                            // if (typeof equipePouleData.equipe !== 'string' || !equipePouleData.equipe) break;
                        
                            let equipeTmp: ClassementResultEquipe = new ClassementResultEquipe(
                                equipePouleData.clt === '-' ? lastClassment : Number(equipePouleData.clt),
                                equipePouleData.equipe,
                                Number(equipePouleData.joue),
                                Number(equipePouleData.pts),
                                equipePouleData.numero,
                                Number(equipePouleData.totvic),
                                Number(equipePouleData.totdef),
                                Number(equipePouleData.idequipe),
                                equipePouleData.idclub,
                                Number(equipePouleData.poule),
                                Number(equipePouleData.vic),
                                Number(equipePouleData.def),
                                Number(equipePouleData.nul),
                                Number(equipePouleData.pf),
                                Number(equipePouleData.pg),
                                Number(equipePouleData.pp)
                            )
    
                            classement.push(equipeTmp);
                            lastClassment = equipePouleData.clt === '-' ? lastClassment : Number(equipePouleData.clt);
                        })
                        return classement;
                    }
                    case 'poule': {
                        let resultData: PouleResultEquipeRaw = result.poule;
                        return new PouleResultEquipe(
                            resultData.libelle,
                            resultData.lien
                        );
                    }
                    case null: {
                        let resultData: TourResultEquipeRaw[] = result.tour;

                        let tours: TourResultEquipe[] = [];
    
                        resultData.forEach((tourData: TourResultEquipeRaw) => {
                            tours.push(new TourResultEquipe(
                                tourData.libelle,
                                tourData.lien,
                                tourData.equa,
                                tourData.equb,
                                tourData.scorea ? Number(tourData.scorea) : null,
                                tourData.scoreb ? Number(tourData.scoreb) : null,
                                tourData.dateprevue, // TODO Type Date
                                tourData.datereelle // TODO Type Date
                            ));
                        })
                        return tours;
                    }
                    default: {
                        return [];
                    }
                 } 
            })
    }

    /**
     * @param string lienDivision
     * @return Rencontre[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getRencontrePouleByLienDivision(lienDivision: string): Promise<Rencontre[]>
    {
        return this.apiRequest.get('xml_result_equ', {}, lienDivision).then((result: any) => {
            let rencontresData = result.tour;
            let rencontres: Rencontre[] = [];

            rencontresData.forEach((dataRencontre: RencontreRaw) => {
                let equipeA = dataRencontre.equa;
                let equipeB = dataRencontre.equb;
    
                rencontres.push(new Rencontre(
                    dataRencontre.libelle,
                    !equipeA ? '': equipeA,
                    !equipeB ? '': equipeB,
                    Number(dataRencontre.scorea),
                    Number(dataRencontre.scoreb),
                    dataRencontre.lien,
                    Utils.createDate(dataRencontre.dateprevue),
                    dataRencontre.datereelle ? Utils.createDate(dataRencontre.datereelle) : null
                ));
            })
            return rencontres;
        })
    }


    /**
     * @param Equipe equipe
     * @return Rencontre[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getProchainesRencontresEquipe(equipe: Equipe): Promise<Rencontre[]>
    {
        return this.getRencontrePouleByLienDivision(equipe.lienDivision).then((result: Rencontre[]) => {
            let nomEquipe: string = Utils.extractNomEquipe(equipe);
            let rencontres: Rencontre[] = result;
            let prochainesRencontres: Rencontre[] = [];
            rencontres.forEach((rencontre: Rencontre) => {
                if (!rencontre.dateReelle && rencontre.nomEquipeA === nomEquipe || rencontre.nomEquipeB === nomEquipe) {
                    prochainesRencontres.push(rencontre);
                }
            })
            return prochainesRencontres;
        });
    }

    /**
     * @param string lienRencontre
     * @param string clubEquipeA
     * @param string clubEquipeB
     * @return RencontreDetails
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws InvalidLienRencontre
     * @throws NoFFTTResponseException
     */
    public getDetailsRencontreByLien(lienRencontre: string, idClubEquipeA: string, idClubEquipeB: string): Promise<RencontreDetails>
    {
        return this.apiRequest.get('xml_chp_renc', {}, lienRencontre).then((result: any) => {
            let factory = new RencontreDetailsFactory(this);
            let detailsRencontreData: RencontreDetailsRaw = result;
        
            if (!(Utils.isset(detailsRencontreData.resultat) && Utils.isset(detailsRencontreData.joueur) && Utils.isset(detailsRencontreData.partie))) {
                throw new InvalidLienRencontre(lienRencontre);
            }
            
            return factory.createFromArray(detailsRencontreData, idClubEquipeA, idClubEquipeB);
        })
    }

    /**
     * @return Actualite[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getActualites(): Promise<Actualite[]>
    {
        return this.apiRequest.get('xml_new_actu').then((data: any) => {
            let actualites: any = Utils.wrappedArrayIfUnique(data.news);
            let result: Actualite[] = [];

            actualites.forEach((dataActualite: ActualiteRaw) => {
                result.push(new Actualite(
                    dataActualite.date,
                    dataActualite.titre,
                    dataActualite.description,
                    dataActualite.url,
                    dataActualite.photo,
                    dataActualite.categorie
                ));
            })
            return result;
        })
    }
}