import { FFTTAPI } from "../FFTTAPI";
import { DynamicObj } from "../Model/DynamicObj.interface";
import { JoueurRencontre } from "../Model/Rencontre/JoueurRencontre";
import { Joueur } from "../Model/Joueur";
import { PartieRencontre } from "../Model/Rencontre/PartieRencontre";
import { RencontreDetails } from "../Model/Rencontre/RencontreDetails";
import { Utils } from "./Utils.service";
import removeAccents from 'remove-accents';
import { PartieDetailsRencontreRaw, RencontreDetailsRaw } from "../Model/Raw/RencontreDetailsRaw.interface";
import { PointsEtSexeIntrouvableException } from "../Exception/PointsEtSexeIntrouvableException";
import { ExpectedPoints, Scores } from "../Model/ScoreEtPoints.interface";

export class RencontreDetailsFactory
{
    private api: FFTTAPI;

    constructor(api: FFTTAPI) {
        this.api = api;
    }

    public async createFromArray(rencontreDetails: RencontreDetailsRaw, clubEquipeA: string, clubEquipeB: string): Promise<RencontreDetails>
    {
        rencontreDetails.joueur = typeof rencontreDetails.joueur !== 'string' ? rencontreDetails.joueur : []; // S'il n'y a pas encore de joueurs
        rencontreDetails.partie = typeof rencontreDetails.partie !== 'string' ? rencontreDetails.partie : []; // S'il n'y a pas encore de parties
        
        let joueursA: string[][] = [];
        let joueursB: string[][] = [];
        
        rencontreDetails.joueur.forEach((joueur: any) => {
            joueursA.push([joueur.xja, joueur.xca]);
            joueursB.push([joueur.xjb, joueur.xcb]);
        })

        let joueursAFormatted = await this.formatJoueurs(joueursA, clubEquipeA);
        let joueursBFormatted = await this.formatJoueurs(joueursB, clubEquipeB);
        let parties: PartieRencontre[] = this.getParties(rencontreDetails.partie);
        let scoreA: number, scoreB: number, scores: Scores;

        if (rencontreDetails.resultat.resa === '') {
            scores = this.getScores(parties);
            scoreA = scores.scoreA;
            scoreB = scores.scoreB;
        } else {
            scoreA = rencontreDetails.resultat.resa === "F0" ? 0 : Number(rencontreDetails.resultat.resa);
            scoreB = rencontreDetails.resultat.resb === "F0" ? 0 : Number(rencontreDetails.resultat.resb);
        }

        let expected = this.getExpectedPoints(parties, joueursAFormatted, joueursBFormatted);

        return new RencontreDetails(
            rencontreDetails.resultat.equa,
            rencontreDetails.resultat.equb,
            scoreA,
            scoreB,
            joueursAFormatted,
            joueursBFormatted,
            parties,
            expected.expectedA,
            expected.expectedB
        );
    }

    /**
     * @param Partie[] parties
     * @param array<string, Joueur> joueursAFormatted
     * @param array<string, Joueur> joueursBFormatted
     * @return array{expectedA: float, expectedB: float}
     */
    // TODO Creer une interface pour joueursAFormatted et joueursBFormatted
    public getExpectedPoints(parties: PartieRencontre[], joueursAFormatted: DynamicObj, joueursBFormatted: DynamicObj): ExpectedPoints
    {
        let expectedA: number = 0;
        let expectedB: number = 0;

        parties.forEach((partie: PartieRencontre) => {
            let adversaireA: string = partie.adversaireA;
            let adversaireB: string = partie.adversaireB;
            let joueurAPoints: string | number | null, joueurBPoints: string | number | null;

            if (Utils.isset(joueursAFormatted[adversaireA])) {
                let joueurA: JoueurRencontre = joueursAFormatted[adversaireA];
                joueurAPoints = joueurA.points;
            } else {
                joueurAPoints = 'NONE';
            }

            if (Utils.isset(joueursBFormatted[adversaireB])) {
                let joueurB: JoueurRencontre = joueursBFormatted[adversaireB];
                joueurBPoints = joueurB.points;
            } else {
                joueurBPoints = 'NONE';
            }

            if (joueurAPoints && joueurBPoints) { // TODO Condition voulue si les deux sont à 'NONE' ?
                if (joueurAPoints === joueurBPoints) {
                    expectedA += 0.5;
                    expectedB += 0.5;
                } else if (joueurAPoints > joueurBPoints) {
                    expectedA += 1;
                } else {
                    expectedB += 1;
                }
            }
        })

        return {
            expectedA: expectedA,
            expectedB: expectedB,
        };
    }

    /**
     * @param Partie[] parties
     * @return array{scoreA: int, scoreB: int}
     */
    public getScores(parties: PartieRencontre[]): Scores
    {
        let scoreA: number = 0;
        let scoreB: number = 0;

        parties.forEach((partie: PartieRencontre) => {
            scoreA += partie.scoreA;
            scoreB += partie.scoreB;
        })

        return {
            scoreA: scoreA,
            scoreB: scoreB,
        };
    }

    /**
     * @param array data
     * @param string playerClubId
     * @return array<string, Joueur>
     */
    public formatJoueurs(nomPrenomJoueurs: string[][], playerClubId: string): Promise<DynamicObj>
    {
        return this.api.getJoueursByClub(playerClubId).then((result: Joueur[]) => {
            let joueursClub: Joueur[] = result;
            let joueurs: DynamicObj = {};

            nomPrenomJoueurs.forEach((joueur: string[]) => {
                let nomPrenom: string = joueur[0];
                let nom: string, prenom: string;
                [nom, prenom] = Utils.returnNomPrenom(nomPrenom);
                joueurs[nomPrenom] = this.formatJoueur(prenom, nom, joueur[1], joueursClub);
            })
            
            return joueurs;
        })
    }

    /**
     * @param prenom 
     * @param nom 
     * @param sexeEtPoints 
     * @param joueursClub 
     * @returns 
     */
    public formatJoueur(prenom: string, nom: string, sexeEtPoints: string, joueursClub: Joueur[]): JoueurRencontre
    {
        if (nom === "" && prenom === "Absent") {
            return new JoueurRencontre(nom, prenom, "", null, null);
        }

        let i: number = 0;
        while (i < joueursClub.length) {
            if (joueursClub[i].nom === removeAccents(nom) && joueursClub[i].prenom === prenom) {
                let result = sexeEtPoints.match(/^(N.[0-9]*- )?([A-Z]{1}) ([0-9]+)pts$/)

                if (result === null || !result.length) {
                    throw new PointsEtSexeIntrouvableException(sexeEtPoints)
                }

                let playerPoints: number = Number(result.slice(-1)); // Dernier item du tableau de matches
                let sexe: string = result.slice(result.length - 2, result.length - 1).toString(); // Avant-dernier item du tableau de matches

                return new JoueurRencontre(
                joueursClub[i].nom,
                    joueursClub[i].prenom,
                    joueursClub[i].licence,
                    playerPoints,
                    sexe
                );
            }
            i++;
        }

        return new JoueurRencontre(nom, prenom, '', null, null);
    }

    /**
     * @param array data
     * @return Partie[]
     */
    public getParties(partieDetailsRencontre: PartieDetailsRencontreRaw[]): PartieRencontre[]
    {
        let parties: PartieRencontre[] = [];

        partieDetailsRencontre.forEach((partieData: PartieDetailsRencontreRaw) => {
            let setDetails: string[] = partieData.detail.split(" ");

            parties.push(new PartieRencontre(
                !partieData.ja ? 'Absent Absent' : partieData.ja,
                !partieData.jb ? 'Absent Absent' : partieData.jb,
                partieData.scorea === '-' ? 0 : Number(partieData.scorea),
                partieData.scoreb === '-' ? 0 : Number(partieData.scoreb),
                setDetails
            ));
        })
        return parties;
    }

}
