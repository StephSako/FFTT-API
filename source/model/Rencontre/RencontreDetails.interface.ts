import { Joueur } from "./Joueur.interface";
import { Partie } from "./Partie.interface";

export interface RencontreDetails {
    nomEquipeA: string;
    nomEquipeB: string;
    scoreEquipeA: number;
    scoreEquipeB: number;
    joueursA: Joueur[];
    joueursB: Joueur[];
    parties: Partie[];
    expectedScoreEquipeA: number;
    expectedScoreEquipeB: number;
}