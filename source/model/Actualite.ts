export class Actualite {
    date: Date;
    titre: string ;
    description: string;
    url: string;
    photo: string;
    categorie: string;

    constructor (
        date: Date,
        titre: string,
        description: string,
        url: string,
        photo: string, 
        categorie: string)
    {
        this.date = date;
        this.titre = titre;
        this.description = description;
        this.url = url;
        this.photo = photo;
        this.categorie = categorie;
    }
}