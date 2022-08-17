import { FFTTAPI } from "../FFTTAPI";
import { DynamicObj } from "../model/DynamicObj.interface";
import { Joueur } from "../model/Rencontre/Joueur";
import { Partie } from "../model/Rencontre/Partie.interface";
import { RencontreDetails } from "../model/Rencontre/RencontreDetails";
import { Utils } from "./Utils.service";
import removeAccents from 'remove-accents';
import { ClubNotFoundException } from "../Exception/ClubNotFoundException";

interface Expected {
    expectedA: number,
    expectedB: number,
}

interface Scores {
    scoreA: number,
    scoreB: number,
}

interface ResultRegex {
    sexe: string,
    points: string,
}

export class RencontreDetailsFactory
{
    private api: FFTTAPI;

    constructor(api: FFTTAPI) {
        this.api = api;
    }

    // TODO Creer une interface pour array
    public createFromArray(array: any, clubEquipeA: string, clubEquipeB: string): RencontreDetails
    {
        let joueursA: any = [];
        let joueursB: any = [];
        array.joueur.forEach((joueur: any) => {
            joueursA.push([joueur.xja ?? '', joueur.xca ?? '']);
            joueursB.push([joueur.xjb ?? '', joueur.xcb ?? '']);
        })

        let joueursAFormatted = this.formatJoueurs(joueursA, clubEquipeA);
        let joueursBFormatted = this.formatJoueurs(joueursB, clubEquipeB);

        let parties: Partie[] = this.getParties(array.partie);
        let scoreA: number, scoreB: number, scores: any;

        if (Array.isArray(array.resultat.resa)) {
            scores = this.getScores(parties);
            scoreA = scores.scoreA;
            scoreB = scores.scoreB;
        } else {
            scoreA = array.resultat.resa == "F0" ? 0 : array.resultat.resa;
            scoreB = array.resultat.resb == "F0" ? 0 : array.resultat.resb;
        }

        let expected = this.getExpectedPoints(parties, joueursAFormatted, joueursBFormatted);

        return new RencontreDetails(
            array.resultat.equa,
            array.resultat.equb,
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
    private getExpectedPoints(parties: Partie[], joueursAFormatted: any, joueursBFormatted: any): Expected
    {
        let expectedA: number = 0;
        let expectedB: number = 0;

        parties.forEach((partie: Partie) => {
            let adversaireA = partie.adversaireA;
            let adversaireB = partie.adversaireB;
            let joueurAPoints, joueurBPoints;

            if (Utils.isset(joueursAFormatted[adversaireA])) {
                let joueurA: Joueur = joueursAFormatted[adversaireA];
                joueurAPoints = joueurA.points;
            } else {
                joueurAPoints = 'NONE';
            }

            if (Utils.isset(joueursBFormatted[adversaireB])) {
                let joueurB: Joueur = joueursBFormatted[adversaireB];
                joueurBPoints = joueurB.points;
            } else {
                joueurBPoints = 'NONE';
            }

            if (joueurAPoints === joueurBPoints) {
                expectedA += 0.5;
                expectedB += 0.5;
            } else if (joueurAPoints > joueurBPoints) {
                expectedA += 1;
            } else {
                expectedB += 1;
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
    private getScores(parties: Partie[]): Scores
    {
        let scoreA = 0;
        let scoreB = 0;

        parties.forEach((partie: Partie) => {
            scoreA += partie.scoreA;
            scoreB += partie.scoreB;
        })

        // TODO Creer interface
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
    private formatJoueurs(data: any, playerClubId: string): DynamicObj
    {
        let joueursClub: Joueur[] = this.api.getJoueursByClub(playerClubId);

        let joueurs: DynamicObj = new Array();
        data.forEach((joueurData: any) => {
            let nomPrenom = joueurData[0];
            let nom: string, prenom: string;
            [nom, prenom] = Utils.returnNomPrenom(nomPrenom);
            joueurs[nomPrenom] = this.formatJoueur(prenom, nom, joueurData[1], joueursClub);
        })
        return joueurs;
    }

    /**
     * @param string prenom
     * @param string nom
     * @param string points
     * @param array joueursClub
     * @return Joueur
     */
    private formatJoueur(prenom: string, nom: string, points: string, joueursClub: Joueur[]): Joueur
    {
        if (nom === "" && prenom === "Absent") {
            return new Joueur(nom, prenom, "", null, null);
        }

        try {
            joueursClub.forEach((joueurClub: Joueur) => {
                if (joueurClub.nom === removeAccents(nom) && joueurClub.prenom === prenom) {
                    let result = points.match(/^(N.[0-9]*- )?([A-Z]{1}) ([0-9]+)pts$/)

                    if (!result) {
                        throw new ClubNotFoundException(`Not able to extract sexe and points in ${points}`)
                    }

                    let playerPoints: number = Number(result.pop() ?? 0);
                    let sexe: string = result.pop() ?? '';

                    return new Joueur(
                        joueurClub.nom,
                        joueurClub.prenom,
                        joueurClub.licence,
                        playerPoints,
                        sexe
                    );
                }
            })
        } catch (e) {}

        return new Joueur(nom, prenom, "", null, null);
    }

    /**
     * @param array data
     * @return Partie[]
     */
    // TODO Créer une interface pour data
    private getParties(data: []): Partie[]
    {
        let parties: Partie[] = [];

        data.forEach((partieData: any) => {
            let setDetails = partieData.detail.split(" ");

            let partie: Partie = (
                partieData.ja ? 'Absent Absent' : partieData.ja,
                partieData.jb ? 'Absent Absent' : partieData.jb,
                partieData.scorea === '-' ? 0 : Number(partieData.scorea),
                partieData.scoreb === '-' ? 0 : Number(partieData.scoreb),
                setDetails
            )
            parties.push(partie);
        })
        return parties;
    }

}
