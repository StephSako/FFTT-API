export class Historique {
    anneeDebut: number;
    anneeFin: number;
    phase: number;
    points: number;

    constructor (
        anneeDebut: number,
        anneeFin: number,
        phase: number,
        points: number)
    {
        this.anneeDebut = anneeDebut;
        this.anneeFin = anneeFin;
        this.phase = phase;
        this.points = points;
    }
}