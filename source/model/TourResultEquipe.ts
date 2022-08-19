export class TourResultEquipe {
    libelle: string;
    lien: string;
    equipeA: string;
    equipeB: string;
    scoreA: number | null;
    scoreB: number | null;
    datePrevue: string; // Format 'd/m/Y
    dateReelle: string; // Format 'd/m/Y

    constructor (
        libelle: string,
        lien: string,
        equipeA: string,
        equipeB: string,
        scoreA: number | null,
        scoreB: number | null,
        datePrevue: string,
        dateReelle: string
    )
    {
        this.libelle = libelle;
        this.lien = lien;
        this.equipeA = equipeA;
        this.equipeB = equipeB;
        this.scoreA = scoreA;
        this.scoreB = scoreB;
        this.datePrevue = datePrevue;
        this.dateReelle = dateReelle;
    }
}