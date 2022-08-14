import { ApiRequest } from "./controller/ApiRequest";
import { Partie } from "./model/Partie.interface";

export class FFTTApi
{
    private id;
    private password;
    private apiRequest;

    // Premier jour de Juillet comptabilisation de la saison
    const PREMIER_JOUR_SAISON = 9;
    /**
     * Dates de publication des matches (on part du principe qu'il n'y aura pas de matches officiels le 30 et 31 Décembre et que la publication aura lieu le 1er Janvier ...)
     * mois => jour
     **/
    const DATES_PUBLICATION = [1 => 1, 2 => 3, 3 => 4, 4 => 6, 5 => 4, 6 => 10, 7 => this.PREMIER_JOUR_SAISON, 10 => 4, 11 => 3];

    public constructor(id: string, password: string)
    {
        this.id = id;
        this.password = md5(password);
        this.apiRequest = new ApiRequest(this.password, this.id);
    }

    public initialize()
    {
        let time = round(microtime(true) * 1000);
        let timeCrypted = hash_hmac("sha1", time, this.password);
        let uri = 'https://apiv2.fftt.com/mobile/pxml/xml_initialisation.php?serie=' . this.id
            . '&tm=' . time
            . '&tmc=' . timeCrypted
            . '&id=' . this.id;

        try{
            let response = this.apiRequest.send(uri);
        }
        catch (ClientException clientException){
            if(clientException.getResponse().getStatusCode() === 401){
                throw new InvalidCredidentials();
            }
            throw clientException;
        }

        return response;
    }

    /**
     * @param string type
     * @return Organisme[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getOrganismes(type: string = "Z"): []
    {
        if (!['Z', 'L', 'D'].includes(type)) {
            type = 'L';
        }

        let organismes = this.apiRequest.get('xml_organisme', [
            'type' => type,
        ])["organisme"];

        result = [];
        foreach (organismes as organisme) {
            result[] = new Organisme(
                organisme["libelle"],
                organisme["id"],
                organisme["code"],
                organisme["idPere"]
            );
        }

        return result;
    }

    /**
     * @param int departementId
     * @return Club[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getClubsByDepartement(int departementId): array
    {

        data = this.apiRequest.get('xml_club_dep2', [
            'dep' => departementId,
        ])['club'];

        clubFactory = new ClubFactory();
        return clubFactory.createFromArray(data);
    }

    /**
     * @param string name
     * @return Club[]
     */
    public getClubsByName(string name)
    {
        try {
            data = this.apiRequest.get('xml_club_b', [
                'ville' => name,
            ])['club'];

            data = this.wrappedArrayIfUnique(data);

            clubFactory = new ClubFactory();
            return clubFactory.createFromArray(data);
        } catch (\Exception e) {
            return [];
        }
    }

    /**
     * @param string clubId
     * @return ClubDetails
     * @throws ClubNotFoundException
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getClubDetails(string clubId): ClubDetails
    {
        clubData = this.apiRequest.get('xml_club_detail', [
            'club' => clubId,
        ])['club'];
        if (empty(clubData['numero'])) {
            throw new ClubNotFoundException(clubId);
        }
        return new ClubDetails(
            intval(clubData['numero']),
            clubData['nom'],
            is_array(clubData['nomsalle']) ? null : clubData['nomsalle'],
            is_array(clubData['adressesalle1']) ? null : clubData['adressesalle1'],
            is_array(clubData['adressesalle2']) ? null : clubData['adressesalle2'],
            is_array(clubData['adressesalle3']) ? null : clubData['adressesalle3'],
            is_array(clubData['codepsalle']) ? null : clubData['codepsalle'],
            is_array(clubData['villesalle']) ? null : clubData['villesalle'],
            is_array(clubData['web']) ? null : clubData['web'],
            is_array(clubData['nomcor']) ? null : clubData['nomcor'],
            is_array(clubData['prenomcor']) ? null : clubData['prenomcor'],
            is_array(clubData['mailcor']) ? null : clubData['mailcor'],
            is_array(clubData['telcor']) ? null : clubData['telcor'],
            is_array(clubData['latitude']) ? null : floatval(clubData['latitude']),
            is_array(clubData['longitude']) ? null : floatval(clubData['longitude'])
        );
    }

    /**
     * @param string clubId
     * @return Joueur[]
     * @throws ClubNotFoundException
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     */
    public getJoueursByClub(string clubId): array
    {
        try {
            arrayJoueurs = this.apiRequest.get('xml_liste_joueur_o', [
                    'club' => clubId,
                ]
            );
        } catch (NoFFTTResponseException e) {
            throw new ClubNotFoundException(clubId);
        }

        result = [];

        foreach (arrayJoueurs['joueur'] as joueur) {
            realJoueur = new Joueur(
                joueur['licence'],
                joueur['nclub'],
                joueur['club'],
                joueur['nom'],
                joueur['prenom'],
                joueur['points']);
            result[] = realJoueur;
        }
        return result;
    }


    /**
     * @param string nom
     * @param string prenom
     * @return Joueur[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getJoueursByNom(string nom, string prenom = ""): array
    {
        arrayJoueurs = this.apiRequest.get('xml_liste_joueur', [
                'nom' => addslashes(Accentuation::remove(nom)),
                'prenom' => addslashes(Accentuation::remove(prenom)),
            ]
        )['joueur'];

        arrayJoueurs = this.wrappedArrayIfUnique(arrayJoueurs);

        result = [];

        foreach (arrayJoueurs as joueur) {
            realJoueur = new Joueur(
                joueur['licence'],
                joueur['nclub'],
                joueur['club'],
                joueur['nom'],
                joueur['prenom'],
                joueur['clast']);
            result[] = realJoueur;
        }
        return result;
    }

    /**
     * @param string licenceId
     * @return JoueurDetails
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws JoueurNotFound
     */
    public getJoueurDetailsByLicence(string licenceId): JoueurDetails
    {
        try {
            data = this.apiRequest.get('xml_licence_b', [
                    'licence' => licenceId,
                ]
            );

            if (!array_key_exists('licence', data)) throw new JoueurNotFound(licenceId);
            data = data['licence'];
        } catch (NoFFTTResponseException e) {
            throw new JoueurNotFound(licenceId);
        }

        joueurDetails = new JoueurDetails(
            licenceId,
            data['nom'],
            data['prenom'],
            data['numclub'],
            data['nomclub'],
            data['sexe'] === 'M' ? true : false,
            data['cat'],
            floatval(data['initm'] ?? floatval(data['point'])),
            floatval(data['point']),
            floatval(data['pointm'] ?? floatval(data['point'])),
            floatval(data['apointm'] ?? floatval(data['point']))
        );
        return joueurDetails;
    }

    /**
     * @param string licenceId
     * @return Classement
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws JoueurNotFound
     */
    public getClassementJoueurByLicence(string licenceId): Classement
    {
        try {
            joueurDetails = this.apiRequest.get('xml_joueur', [
                'licence' => licenceId,
            ])['joueur'];
        } catch (NoFFTTResponseException e) {
            throw new JoueurNotFound(licenceId);
        }

        classement = new Classement(
            new \DateTime(),
            joueurDetails['point'],
            joueurDetails['apoint'],
            intval(joueurDetails['clast']),
            intval(joueurDetails['clnat']),
            intval(joueurDetails['rangreg']),
            intval(joueurDetails['rangdep']),
            intval(joueurDetails['valcla']),
            intval(joueurDetails['valinit'])
        );
        return classement;
    }

    /**
     * @param string licenceId
     * @return Historique[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws JoueurNotFound
     */
    public getHistoriqueJoueurByLicence(string licenceId): array
    {
        try {
            classements = this.apiRequest.get('xml_histo_classement', [
                'numlic' => licenceId,
            ])['histo'];
        } catch (NoFFTTResponseException e) {
            throw new JoueurNotFound(licenceId);
        }
        result = [];
        classements = this.wrappedArrayIfUnique(classements);

        foreach (classements as classement) {
            explode = explode(' ', classement['saison']);

            historique = new Historique(explode[1], explode[3], intval(classement['phase']), intval(classement['point']));
            result[] = historique;
        }

        return result;
    }

    /**
     * @param string joueurId
     * @return Partie[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     */
    public getPartiesJoueurByLicence(joueurId: string): Partie[]
    {
        try {
            parties = this.apiRequest.get('xml_partie_mysql', [
                'licence' => joueurId,
            ])['partie'];
            parties = this.wrappedArrayIfUnique(parties);
        } catch (NoFFTTResponseException e) {
            parties = [];
        }
        res = [];

        foreach (parties as partie) {
            list(nom, prenom) = Utils::returnNomPrenom(partie['advnompre']);
            realPartie = new Partie(
                partie["vd"] === "V" ? true : false,
                intval(partie['numjourn']),
                \DateTime::createFromFormat('d/m/Y', partie['date']),
                floatval(partie['pointres']),
                floatval(partie['coefchamp']),
                partie['advlic'],
                partie['advsexe'] === 'M' ? true : false,
                nom,
                prenom,
                intval(partie['advclaof'])
            );
            res[] = realPartie;
        }
        return res;
    }

    /**
     * Détermine si la date d'un match est hors de la plage des dates définissant les matches comme validés/comptabilisés
     */
    public isNouveauMoisVirtuel(date: Date): boolean {
        try {
            let jour = date.format('j');
            let mois = date.format('n');
            let annee = date.format('Y');
            let moisActuel = (new Datetime()).format('n');

            while (!array_key_exists(mois, this.DATES_PUBLICATION)) {
                if (mois == 12) {
                    mois = 1;
                    annee++;
                } else mois++;
            }
            return date.getTimestamp() >= (new Datetime(annee . '/' . mois . '/' . this.DATES_PUBLICATION[mois])).getTimestamp();
        } catch (\Exception e) {
            return false;
        }
    }

    /**
     * @param string joueurId
     * @return UnvalidatedPartie[]
     * @throws InvalidURIParametersException
     * @throws URIPartNotValidException
     */
    public getUnvalidatedPartiesJoueurByLicence(string joueurId): array
    {
        validatedParties = this.getPartiesJoueurByLicence(joueurId);
        try {
            allParties = this.apiRequest.get('xml_partie', [
                    'numlic' => joueurId,
                ])["partie"] ?? [];
        } catch (NoFFTTResponseException e) {
            allParties = [];
        }

        result = [];
        try {
            foreach (allParties as partie) {
                if (partie["forfait"] === "0") {
                    list(nom, prenom) = Utils::returnNomPrenom(partie['nom']);
                    found = count(array_filter(validatedParties, (validatedPartie) use (partie, nom, prenom) {
                        datePartie = \DateTime::createFromFormat('d/m/Y', partie['date']);
                        return partie["date"] === validatedPartie.getDate().format("d/m/Y")
                            /** Si le nom du joueur correspond bien */
                            && Utils::removeAccentLowerCaseRegex(nom) === Utils::removeAccentLowerCaseRegex(validatedPartie.getAdversaireNom())
                            /** Si le prénom du joueur correspond bien */
                            && (
                                preg_match('/' . Utils::removeAccentLowerCaseRegex(prenom) . '.*/', Utils::removeAccentLowerCaseRegex(validatedPartie.getAdversairePrenom())) or
                                str_contains(Utils::removeAccentLowerCaseRegex(prenom), Utils::removeAccentLowerCaseRegex(validatedPartie.getAdversairePrenom()))
                            )
                            /** Si le coefficient est renseigné */
                            && validatedPartie.getCoefficient() === floatval(partie['coefchamp'])
                            /** Si le joueur n'est pas absent */
                            && !str_contains(prenom, "Absent") and !str_contains(nom, "Absent")
                            /** Si la partie a été réalisée durant le mois dernier ou durant le mois actuel */
                            && !(
                                validatedPartie.getPointsObtenus() === 0.0
                                && (
                                    (datePartie.format('n') === (new DateTime()).format('n')
                                        && datePartie.format('Y') === (new DateTime()).format('Y'))
                                    || (datePartie.format('n') . '/' . datePartie.format('Y')) === date('n', strtotime('-1 month')) . '/' . date('Y', strtotime('-1 month'))
                                )
                            );
                    }));

                    if (!found) {
                        result[] = new UnvalidatedPartie(
                            partie["epreuve"],
                            partie["idpartie"],
                            floatval(partie["coefchamp"]),
                            partie["victoire"] === "V",
                            false,
                            \DateTime::createFromFormat('d/m/Y', partie['date']),
                            nom,
                            prenom,
                            Utils::formatPoints(partie["classement"])
                        );
                    }
                }
            }
            return result;
        } catch (\Exception e) {
            return [];
        }
    }

    /**
     * @param string joueurId
     * @return VirtualPoints Objet contenant les points gagnés/perdus et le classement virtuel du joueur
     */
    public getJoueurVirtualPoints(string joueurId): VirtualPoints
    {
        pointCalculator = new PointCalculator();

        try {
            classement = this.getClassementJoueurByLicence(joueurId);
            virtualMonthlyPointsWon = 0.0;
            virtualMonthlyPoints = 0.0;
            latestMonth = null;
            monthPoints = round(classement.getPoints(), 1);
            unvalidatedParties = this.getUnvalidatedPartiesJoueurByLicence(joueurId);

            usort(unvalidatedParties, (UnvalidatedPartie a, UnvalidatedPartie b) {
                return a.getDate() >= b.getDate();
            });

            foreach (unvalidatedParties as unvalidatedParty) {
                if (!latestMonth) {
                    latestMonth = unvalidatedParty.getDate().format("m");
                } else {
                    if (latestMonth != unvalidatedParty.getDate().format("m") && this.isNouveauMoisVirtuel(unvalidatedParty.getDate())) {
                        monthPoints = round(classement.getPoints() + virtualMonthlyPointsWon, 1);
                        latestMonth = unvalidatedParty.getDate().format("m");
                    }
                }

                coeff = unvalidatedParty.getCoefficientChampionnat();

                if (!unvalidatedParty.isForfait()) {
                    adversairePoints = unvalidatedParty.getAdversaireClassement();

                    /**
                     * TODO Refactoring in method
                     */

                    try {
                        availableJoueurs = this.getJoueursByNom(unvalidatedParty.getAdversaireNom(), unvalidatedParty.getAdversairePrenom());
                        foreach (availableJoueurs as availableJoueur) {
                            if (round((unvalidatedParty.getAdversaireClassement() / 100)) == availableJoueur.getPoints()) {
                                classementJoueur = this.getClassementJoueurByLicence(availableJoueur.getLicence());
                                adversairePoints = round(classementJoueur.getPoints(), 1);
                                break;
                            }
                        }
                    } catch (NoFFTTResponseException e) {
                        adversairePoints = unvalidatedParty.getAdversaireClassement();
                    } catch (InvalidURIParametersException e) {
                        adversairePoints = unvalidatedParty.getAdversaireClassement();
                    }

                    points = unvalidatedParty.isVictoire()
                        ? pointCalculator.getPointVictory(monthPoints, floatval(adversairePoints))
                        : pointCalculator.getPointDefeat(monthPoints, floatval(adversairePoints));
                    virtualMonthlyPointsWon += points * coeff;
                }
            }

            virtualMonthlyPoints = monthPoints + virtualMonthlyPointsWon;
            return new VirtualPoints(
                virtualMonthlyPointsWon,
                virtualMonthlyPoints,
                virtualMonthlyPoints - classement.getPointsInitials()
            );
        } catch (JoueurNotFound e) {
            return new VirtualPoints(0.0, this.getJoueurDetailsByLicence(joueurId).getPointsLicence(), 0.0);
        }
    }

    /**
     * @param string joueurId
     * @return float points mensuels gagnés ou perdus en fonction des points mensuels de l'adversaire
     */
    public getVirtualPoints(string joueurId) : float {
        return this.getJoueurVirtualPoints(joueurId).getPointsWon();
    }

    /**
     * @param string clubId
     * @param string|null type
     * @return Equipe[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getEquipesByClub(string clubId, string type = null)
    {
        params = [
            'numclu' => clubId,
        ];
        if (type) {
            params['type'] = type;
        }

        if (this.apiRequest.get('xml_equipe', params) == []) return [];
        data = this.apiRequest.get('xml_equipe', params)['equipe'];
        data = this.wrappedArrayIfUnique(data);

        result = [];
        foreach (data as dataEquipe) {
            result[] = new Equipe(
                dataEquipe['libequipe'],
                dataEquipe['libdivision'],
                dataEquipe['liendivision']
            );
        }
        return result;
    }

    /**
     * @param string lienDivision
     * @return EquipePoule[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getClassementPouleByLienDivision(string lienDivision): array
    {
        data = this.apiRequest.get('xml_result_equ', ["action" => "classement"], lienDivision)['classement'];
        result = [];
        lastClassment = 0;
        foreach (data as equipePouleData) {

            if (!is_string(equipePouleData['equipe'])) {
                break;
            }

            result[] = new EquipePoule(
                equipePouleData['clt'] === '-' ? lastClassment : intval(equipePouleData['clt']),
                equipePouleData['equipe'],
                intval(equipePouleData['joue']),
                intval(equipePouleData['pts']),
                equipePouleData['numero'],
                intval(equipePouleData['totvic']),
                intval(equipePouleData['totdef']),
                intval(equipePouleData['idequipe']),
                equipePouleData['idclub']
            );
            lastClassment = equipePouleData['clt'] == "-" ? lastClassment : intval(equipePouleData['clt']);
        }
        return result;
    }

    /**
     * @param string lienDivision
     * @return Rencontre[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getRencontrePouleByLienDivision(string lienDivision): array
    {
        data = this.apiRequest.get('xml_result_equ', [], lienDivision)['tour'];


        result = [];
        foreach (data as dataRencontre) {
            equipeA = dataRencontre['equa'];
            equipeB = dataRencontre['equb'];

            result[] = new Rencontre(
                dataRencontre['libelle'],
                is_array(equipeA) ? '': equipeA,
                is_array(equipeB) ? '': equipeB,
                intval(dataRencontre['scorea']),
                intval(dataRencontre['scoreb']),
                dataRencontre['lien'],
                \DateTime::createFromFormat('d/m/Y', dataRencontre['dateprevue']),
                empty(dataRencontre['datereelle']) ? null : \DateTime::createFromFormat('d/m/Y', dataRencontre['datereelle'])
            );
        }
        return result;
    }


    /**
     * @param Equipe equipe
     * @return Rencontre[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getProchainesRencontresEquipe(Equipe equipe): array
    {
        nomEquipe = Utils::extractNomEquipe(equipe);
        rencontres = this.getRencontrePouleByLienDivision(equipe.getLienDivision());

        prochainesRencontres = [];
        foreach (rencontres as rencontre) {
            if (rencontre.getDateReelle() === null && rencontre.getNomEquipeA() === nomEquipe || rencontre.getNomEquipeB() === nomEquipe) {
                prochainesRencontres[] = rencontre;
            }
        }
        return prochainesRencontres;
    }

    /**
     * @param Equipe equipe
     * @return ClubDetails|null
     * @throws ClubNotFoundException
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getClubEquipe(Equipe equipe): ?ClubDetails
    {
        nomEquipe = Utils::extractClub(equipe);
        club = this.getClubsByName(nomEquipe);

        if(count(club) === 1){
            return this.getClubDetails(club[0].getNumero());
        }

        return null;
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
    public getDetailsRencontreByLien(string lienRencontre, string clubEquipeA = "", string clubEquipeB = ""): RencontreDetails
    {
        data = this.apiRequest.get('xml_chp_renc', [], lienRencontre);
        if (!(isset(data['resultat']) && isset(data['joueur']) && isset(data['partie']))) {
            throw new InvalidLienRencontre(lienRencontre);
        }
        factory = new RencontreDetailsFactory(this);
        return factory.createFromArray(data, clubEquipeA, clubEquipeB);
    }

    /**
     * @return Actualite[]
     * @throws Exception\InvalidURIParametersException
     * @throws Exception\URIPartNotValidException
     * @throws NoFFTTResponseException
     */
    public getActualites(): array
    {
        data = this.apiRequest.get('xml_new_actu')['news'];
        data = this.wrappedArrayIfUnique(data);

        result = [];
        foreach (data as dataActualite) {
            result[] = new Actualite(
                \DateTime::createFromFormat('Y-m-d', dataActualite["date"]),
                dataActualite['titre'],
                dataActualite['description'],
                dataActualite['url'],
                dataActualite['photo'],
                dataActualite['categorie']
            );
        }
        return result;
    }

    private wrappedArrayIfUnique(array): array
    {
        if (count(array) == count(array, COUNT_RECURSIVE)) {
            return [array];
        }
        return array;
    }
}