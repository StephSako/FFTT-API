export class Historique {
    anneeDebut: number;
    anneeFin: number;
    phase: number;
    points: number;
    echelon: string | null;
    place: number | null;

    constructor (
        anneeDebut: number,
        anneeFin: number,
        phase: number,
        points: number,
        echelon: string | null,
        place: number | null
    )
    {
        this.anneeDebut = anneeDebut;
        this.anneeFin = anneeFin;
        this.phase = phase;
        this.points = points;
        this.echelon = echelon;
        this.place = place;
    }
}