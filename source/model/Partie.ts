export class Partie {
    idPartie: number;
    licence: string;
    isVictoire: boolean;
    journee: number | null;
    date: Date;
    pointsObtenus: number;
    coefficient: number;
    adversaireLicence: string;
    adversaireIsHomme: boolean;
    adversaireNom: string;
    adversairePrenom: string;
    adversaireClassement: number;
    codeChampionnat: string;

    constructor (
        isVictoire: boolean,
        journee: number | null,
        date: Date,
        pointsObtenus: number,
        coefficient: number,
        adversaireLicence: string,
        adversaireIsHomme: boolean,
        adversaireNom: string,
        adversairePrenom: string,
        adversaireClassement: number,
        licence: string,
        idPartie: number,
        codeChampionnat: string
    )
    {
        this.isVictoire = isVictoire;
        this.journee = journee;
        this.date = date;
        this.pointsObtenus = pointsObtenus;
        this.coefficient = coefficient;
        this.adversaireLicence = adversaireLicence;
        this.adversaireIsHomme = adversaireIsHomme;
        this.adversaireNom = adversaireNom;
        this.adversairePrenom = adversairePrenom;
        this.adversaireClassement = adversaireClassement;
        this.licence = licence;
        this.idPartie = idPartie;
        this.codeChampionnat = codeChampionnat;
    }
}