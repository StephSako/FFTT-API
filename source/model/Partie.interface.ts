export interface Partie {
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
}