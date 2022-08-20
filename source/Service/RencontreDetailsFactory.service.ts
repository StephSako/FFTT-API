import { FFTTAPI } from "../FFTTAPI";
import { DynamicObj } from "../model/DynamicObj.interface";
import { JoueurRencontre } from "../model/Rencontre/JoueurRencontre";
import { Joueur } from "../model/Joueur";
import { PartieRencontre } from "../model/Rencontre/PartieRencontre";
import { RencontreDetails } from "../model/Rencontre/RencontreDetails";
import { Utils } from "./Utils.service";
import removeAccents from 'remove-accents';
import { ClubNotFoundException } from "../Exception/ClubNotFoundException";
import { PartieDetailsRencontreRaw, RencontreDetailsRaw } from "../model/Raw/RencontreDetailsRaw.interface";

interface Expected {
    expectedA: number,
    expectedB: number,
}

interface Scores {
    scoreA: number,
    scoreB: number,
}

export class RencontreDetailsFactory
{
    private api: FFTTAPI;

    constructor(api: FFTTAPI) {
        this.api = api;
    }

    public async createFromArray(rencontreDetails: RencontreDetailsRaw, clubEquipeA: string, clubEquipeB: string): Promise<RencontreDetails>
    {
        rencontreDetails.joueur = rencontreDetails.joueur ? rencontreDetails.joueur : [];
        rencontreDetails.partie = rencontreDetails.partie ? rencontreDetails.partie : [];
        
        let joueursA: any[] = [];
        let joueursB: any[] = [];
        rencontreDetails.joueur.forEach((joueur: any) => {
            joueursA.push([joueur.xja ?? '', joueur.xca ?? '']); // TODO Check ??
            joueursB.push([joueur.xjb ?? '', joueur.xcb ?? '']); // TODO Check ??
        })

        let joueursAFormatted = await this.formatJoueurs(joueursA, clubEquipeA);
        let joueursBFormatted = await this.formatJoueurs(joueursB, clubEquipeB);

        let parties: PartieRencontre[] = this.getParties(rencontreDetails.partie);
        let scoreA: number, scoreB: number, scores: any;

        if (Array.isArray(rencontreDetails.resultat.resa)) {
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
    private getExpectedPoints(parties: PartieRencontre[], joueursAFormatted: any, joueursBFormatted: any): Expected
    {
        let expectedA: number = 0;
        let expectedB: number = 0;

        parties.forEach((partie: PartieRencontre) => {
            let adversaireA = partie.adversaireA;
            let adversaireB = partie.adversaireB;
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

            if (joueurAPoints && joueurBPoints) {
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
    private getScores(parties: PartieRencontre[]): Scores
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
    private formatJoueurs(data: any[], playerClubId: string): Promise<DynamicObj[]>
    {
        return this.api.getJoueursByClub(playerClubId).then((result: Joueur[]) => {
            let joueursClub: Joueur[] = result;
            let joueurs: DynamicObj[] = [];

            data.forEach((joueur: any) => {
                let nomPrenom = joueur[0];
                let nom: string, prenom: string;
                [nom, prenom] = Utils.returnNomPrenom(nomPrenom);
                joueurs[nomPrenom] = this.formatJoueur(prenom, nom, joueur[1], joueursClub);
            })
            return joueurs;
        })
    }

    /**
     * @param string prenom
     * @param string nom
     * @param string points
     * @param array joueursClub
     * @return Joueur
     */
    private formatJoueur(prenom: string, nom: string, points: string, joueursClub: Joueur[]): JoueurRencontre
    {
        if (nom === "" && prenom === "Absent") {
            return new JoueurRencontre(nom, prenom, "", null, null);
        }

        try {
            joueursClub.forEach((joueurClub: Joueur) => {
                if (joueurClub.nom === removeAccents(nom) && joueurClub.prenom === prenom) {
                    let result = points.match(/^(N.[0-9]*- )?([A-Z]{1}) ([0-9]+)pts$/)

                    if (!result) {
                        throw new ClubNotFoundException(`impossible d'extraire le sexe et les points dans '${points}'`)
                    }

                    let playerPoints: number = Number(result.pop() ?? 0);
                    let sexe: string = result.pop() ?? '';

                    return new JoueurRencontre(
                        joueurClub.nom,
                        joueurClub.prenom,
                        joueurClub.licence,
                        playerPoints,
                        sexe
                    );
                }
            })
        } catch (e) {}

        return new JoueurRencontre(nom, prenom, "", null, null);
    }

    /**
     * @param array data
     * @return Partie[]
     */
    private getParties(partieDetailsRencontre: PartieDetailsRencontreRaw[]): PartieRencontre[]
    {
        let parties: PartieRencontre[] = [];

        partieDetailsRencontre.forEach((partieData: PartieDetailsRencontreRaw) => {
            let setDetails: string[] = partieData.detail.split(" ");

            parties.push(new PartieRencontre(
                partieData.ja ? 'Absent Absent' : partieData.ja,
                partieData.jb ? 'Absent Absent' : partieData.jb,
                partieData.scorea === '-' ? 0 : Number(partieData.scorea),
                partieData.scoreb === '-' ? 0 : Number(partieData.scoreb),
                setDetails
            ));
        })
        return parties;
    }

}
