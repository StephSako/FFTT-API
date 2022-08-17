import { Joueur } from "./Joueur";
import { Partie } from "./Partie.interface";

export class RencontreDetails {
    nomEquipeA: string;
    nomEquipeB: string;
    scoreEquipeA: number;
    scoreEquipeB: number;
    joueursA: Joueur[];
    joueursB: Joueur[];
    parties: Partie[];
    expectedScoreEquipeA: number;
    expectedScoreEquipeB: number;

    constructor (
        nomEquipeA: string,
        nomEquipeB: string,
        scoreEquipeA: number,
        scoreEquipeB: number,
        joueursA: any[],
        joueursB: any[],
        parties: any[],
        expectedScoreEquipeA: number,
        expectedScoreEquipeB: number
    )
    {
        this.nomEquipeA = nomEquipeA;
        this.nomEquipeB = nomEquipeB;
        this.scoreEquipeA = scoreEquipeA;
        this.scoreEquipeB = scoreEquipeB;
        this.joueursA = joueursA;
        this.joueursB = joueursB;
        this.parties = parties;
        this.expectedScoreEquipeA = expectedScoreEquipeA;
        this.expectedScoreEquipeB = expectedScoreEquipeB;
    }
}