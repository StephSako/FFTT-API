export interface JoueurRaw {
    licence: string;
    club: string;
    nclub: string;
    nom: string;
    sexe: string;
    echelon: string | null; // Vaut 'N' ou rien
    prenom: string;
    points: string;
    clast: string; // Pour xml_liste_joueur.php
    place: number | null; // Place si numéroté
}