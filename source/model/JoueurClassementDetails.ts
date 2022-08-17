export class JoueurClassementDetails {
    idLicence: number;
    licence: string;
    nom: string;
    prenom: string;
    numClub: string;
    nomClub: string;
    isHomme: boolean;
    categorie: string; // Catégorie d'âge
    pointDebutSaison: number;
    pointsLicence: number;
    pointsMensuel: number;
    pointsMensuelAnciens: number;
    diplomeJugeArbitre: string | null;
    diplomeArbitre: string | null;
    diplomeTechnique: string | null;
    dateMutation: string | null; // Date au format 'd/m/Y'
    nationalite: string; // 'F' ou 'E'
    echelon: string | null; // 'N'
    place: number | null; 
    typeLicence: string | null;  // Type de licence (T ou P)
    certificat: string;  // 'C', 'A'

    constructor (
        idLicence: number,
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
        pointsMensuelAnciens: number,
        diplomeJugeArbitre: string | null,
        diplomeArbitre: string | null,
        diplomeTechnique: string | null,
        dateMutation: string | null,
        nationalite: string,
        echelon: string | null,
        place: number | null,
        typeLicence: string | null,
        certificat: string
    )
    {
        this.idLicence = idLicence;
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
        this.diplomeJugeArbitre = diplomeJugeArbitre;
        this.diplomeArbitre = diplomeArbitre;
        this.diplomeTechnique = diplomeTechnique;
        this.dateMutation = dateMutation;
        this.nationalite = nationalite;
        this.echelon = echelon;
        this.place = place;
        this.typeLicence = typeLicence;
        this.certificat = certificat;
    }
}
