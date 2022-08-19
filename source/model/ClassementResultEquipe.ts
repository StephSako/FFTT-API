export class ClassementResultEquipe {
    classement: number;
    nomEquipe: string;
    matchJouees: number;
    points: number;
    numero: string;
    totalVictoires: number;
    totalDefaites: number;
    idEquipe: number;
    idCLub: string;
    poule: number;
    victoires: number;
    defaites: number;
    egalites: number;
    pf: number;
    pg: number;
    pp: number;

    constructor (
        classement: number,
        nomEquipe: string,
        matchJouees: number,
        points: number,
        numero: string,
        totalVictoires: number,
        totalDefaites: number,
        idEquipe: number,
        idCLub: string,
        poule: number,
        victoires: number,
        defaites: number,
        egalites: number,
        pf: number,
        pg: number,
        pp: number,
    )
    {
        this.classement = classement;
        this.nomEquipe = nomEquipe;
        this.matchJouees = matchJouees;
        this.points = points;
        this.numero = numero;
        this.totalVictoires = totalVictoires;
        this.totalDefaites = totalDefaites;
        this.idEquipe = idEquipe;
        this.idCLub = idCLub;
        this.poule = poule;
        this.victoires = victoires;
        this.defaites = defaites;
        this.egalites = egalites;
        this.pf = pf;
        this.pg = pg;
        this.pp = pp;
    }
}