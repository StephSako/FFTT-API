export class Joueur {
    licence: string;
    clubId: string;
    club: string;
    nom: string;
    prenom: string;
    points: string | null; /* Points du joueur ou classement si classé dans les 1000 premiers français */

    constructor (
        licence: string,
        clubId: string,
        club: string,
        nom: string,
        prenom: string,
        points: string | null)
    {
        this.licence = licence;
        this.clubId = clubId;
        this.club = club;
        this.nom = nom;
        this.prenom = prenom;
        this.points = points;
    }
}