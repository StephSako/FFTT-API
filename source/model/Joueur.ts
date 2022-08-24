export class Joueur {
    licence: string;
    clubId: string;
    club: string;
    nom: string;
    prenom: string;
    points?: number | null;
    isHomme?: boolean | null;
    classementOfficiel?: string | null; // TODO Vérifier string
    echelon?: string | null;
    place?: number | null;

    constructor (
        licence: string,
        clubId: string,
        club: string,
        nom: string,
        prenom: string,
        points: number | null,
        isHomme: boolean | null,
        classementOfficiel: string | null,
        place: number | null,
        echelon: string | null
    )
    {
        this.licence = licence;
        this.clubId = clubId;
        this.club = club;
        this.nom = nom;
        this.prenom = prenom;
        this.points = points;
        this.isHomme = isHomme;
        this.classementOfficiel = classementOfficiel;
        this.place = place;
        this.echelon = echelon;
    }
}