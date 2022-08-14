export interface Joueur {
    licence: string;
    clubId: string;
    club: string;
    nom: string;
    prenom: string;
    points?: string; /* Points du joueur ou classement si classé dans les 1000 premiers français */
}