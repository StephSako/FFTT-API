export class ClubDetails {
    numero: number;
    nom: string;
    nomSalle: string | null;
    adresseSalle1: string | null;
    adresseSalle2: string | null;
    adresseSalle3: string | null;
    codePostaleSalle: string | null;
    villeSalle: string | null;
    siteWeb: string | null;
    nomCoordo: string | null;
    prenomCoordo: string | null;
    mailCoordo: string | null;
    telCoordo: string | null;
    latitude: number | null;
    longitude: number | null;

    constructor (
        numero: number,
        nom: string,
        nomSalle: string | null,
        adresseSalle1: string | null,
        adresseSalle2: string | null,
        adresseSalle3: string | null,
        codePostaleSalle: string | null,
        villeSalle: string | null,
        siteWeb: string | null,
        nomCoordo: string | null,
        prenomCoordo: string | null,
        mailCoordo: string | null,
        telCoordo: string | null,
        latitude: number | null,
        longitude: number | null
    )
    {
        this.numero = numero;
        this.nom = nom;
        this.nomSalle = nomSalle;
        this.adresseSalle1 = adresseSalle1;
        this.adresseSalle2 = adresseSalle2;
        this.adresseSalle3 = adresseSalle3;
        this.codePostaleSalle = codePostaleSalle;
        this.villeSalle = villeSalle;
        this.siteWeb = siteWeb;
        this.nomCoordo = nomCoordo;
        this.prenomCoordo = prenomCoordo;
        this.mailCoordo = mailCoordo;
        this.telCoordo = telCoordo;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}