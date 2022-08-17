export class Classement {
    points: number;
    anciensPoints: number;
    classement: string;
    rangRegional: number;
    rangNational: number;
    rangDepartemental: number;
    pointsOfficiels: number;
    pointsInitials: number;
    licence: string;
    nom: string;
    prenom: string;
    nomClub: string;
    numeroClub: string;
    nationalite: string | null;
    classementGlobal: number
    ancienClassementGlobal: number;
    categorie: string; // Catégorie d'âge
    propositionClassement: string; // Proposition de classement

    constructor (
        points: number,
        anciensPoints: number,
        classement: string,
        rangNational: number,
        rangRegional: number,
        rangDepartemental: number,
        pointsOfficiels: number,
        pointsInitials: number,
        licence: string,
        nom: string,
        prenom: string,
        nomClub: string,
        numeroClub: string,
        nationalite: string | null,
        classementGlobal: number,
        ancienClassementGlobal: number,
        categorie: string,
        propositionClassement: string
    )
    {
        this.points = points;
        this.anciensPoints = anciensPoints;
        this.classement = classement;
        this.rangNational = rangNational;
        this.rangRegional = rangRegional;
        this.rangDepartemental = rangDepartemental;
        this.pointsOfficiels = pointsOfficiels;
        this.pointsInitials = pointsInitials;
        this.licence = licence;
        this.nom = nom;
        this.prenom = prenom;
        this.nomClub = nomClub;
        this.numeroClub = numeroClub;
        this.nationalite = nationalite;
        this.classementGlobal = classementGlobal;
        this.ancienClassementGlobal = ancienClassementGlobal;
        this.categorie = categorie;
        this.propositionClassement = propositionClassement;
    }
}