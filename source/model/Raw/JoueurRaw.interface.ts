export interface JoueurRaw {
    licence: string;
    club: string;
    nclub: string;
    nom: string;
    sexe: string;
    echelon: string; // Vaut 'N' ou rien
    prenom: string;
    points: string;
    clast: string; // Pour xml_liste_joueur.php
    place: string; // Place si numéroté
}