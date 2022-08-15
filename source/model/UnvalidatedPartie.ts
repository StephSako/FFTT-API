export class UnvalidatedPartie {
    epreuve: string;
    idPartie: string;
    coefficientChampionnat: number;
    isVictoire: boolean;
    isForfait: boolean;
    date: Date;
    adversaireNom: string;
    adversairePrenom: string;
    adversaireClassement: number;

    constructor (
        epreuve: string,
        idPartie: string,
        coefficientChampionnat: number,
        isVictoire: boolean,
        isForfait: boolean,
        date: Date,
        adversaireNom: string,
        adversairePrenom: string,
        adversaireClassement: number
    )
    {
        this.isVictoire = isVictoire;
        this.idPartie = idPartie;
        this.isForfait = isForfait;
        this.date = date;
        this.adversaireNom = adversaireNom;
        this.adversairePrenom = adversairePrenom;
        this.adversaireClassement = adversaireClassement;
        this.coefficientChampionnat = coefficientChampionnat;
        this.epreuve = epreuve;
    }
}