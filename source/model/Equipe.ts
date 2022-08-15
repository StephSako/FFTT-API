export class Equipe {
    libelle: string;
    division: string;
    lienDivision: string;

    constructor (
        libelle: string,
        division: string,
        lienDivision: string)
    {
        this.libelle = libelle;
        this.division = division;
        this.lienDivision = lienDivision;
    }
}