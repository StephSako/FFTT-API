export class Partie {
    isVictoire: boolean;
    journee: number;
    date: Date;
    pointsObtenus: number;
    coefficient: number;
    adversaireLicence: string;
    adversaireIsHomme: boolean;
    adversaireNom: string;
    adversairePrenom: string;
    adversaireClassement: number;

    constructor (
        isVictoire: boolean,
        journee: number,
        date: Date,
        pointsObtenus: number,
        coefficient: number,
        adversaireLicence: string,
        adversaireIsHomme: boolean,
        adversaireNom: string,
        adversairePrenom: string,
        adversaireClassement: number
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
    }
}