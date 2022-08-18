export class Equipe {
    libelle: string;
    division: string;
    lienDivision: string;
    idEquipe: number;
    idEpreuve: number;
    libelleEpreuve: string;

    constructor (
        libelle: string,
        division: string,
        lienDivision: string,
        idEquipe: number,
        idEpreuve: number,
        libelleEpreuve: string
    )
    {
        this.libelle = libelle;
        this.division = division;
        this.lienDivision = lienDivision;
        this.idEquipe = idEquipe;
        this.idEpreuve = idEpreuve;
        this.libelleEpreuve = libelleEpreuve;
    }
}