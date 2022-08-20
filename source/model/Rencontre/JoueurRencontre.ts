export class JoueurRencontre {
    nom: string;
    prenom: string;
    points: number | null;
    sexe: string | null;
    licence: string;

    constructor (
        nom: string,
        prenom: string,
        licence: string,
        points: number | null,
        sexe: string | null)
    {
        this.nom = nom;
        this.prenom = prenom;
        this.licence = licence;
        this.points = points;
        this.sexe = sexe;
    }
}