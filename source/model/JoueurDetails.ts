export class JoueurDetails {
    licence: string;
    nom: string;
    prenom: string;
    numClub: string;
    nomClub: string;
    isHomme: boolean;
    categorie: string;
    pointDebutSaison: number;
    pointsLicence: number;
    pointsMensuel: number;
    pointsMensuelAnciens: number;

    constructor (
        licence: string,
        nom: string,
        prenom: string,
        numClub: string,
        nomClub: string,
        isHomme: boolean,
        categorie: string,
        pointDebutSaison: number,
        pointsLicence: number,
        pointsMensuel: number,
        pointsMensuelAnciens: number
    )
    {
        this.licence = licence;
        this.nom = nom;
        this.prenom = prenom;
        this.numClub = numClub;
        this.nomClub = nomClub;
        this.isHomme = isHomme;
        this.categorie = categorie;
        this.pointDebutSaison = pointDebutSaison;
        this.pointsLicence = pointsLicence;
        this.pointsMensuel = pointsMensuel;
        this.pointsMensuelAnciens = pointsMensuelAnciens;
    }
}
