export class EquipePoule {
    classement: number;
    nomEquipe: string;
    matchJouees: number;
    points: number;
    numero: string;
    victoires: number;
    defaites: number;
    idEquipe: number;
    idCLub: string;

    constructor (
        classement: number,
        nomEquipe: string,
        matchJouees: number,
        points: number,
        numero: string,
        victoires: number,
        defaites: number,
        idEquipe: number,
        idCLub: string)
    {
        this.classement = classement;
        this.nomEquipe = nomEquipe;
        this.matchJouees = matchJouees;
        this.points = points;
        this.numero = numero;
        this.victoires = victoires;
        this.defaites = defaites;
        this.idEquipe = idEquipe;
        this.idCLub = idCLub;
    }
}