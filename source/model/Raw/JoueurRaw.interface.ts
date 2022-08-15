export interface JoueurRaw {
    licence: string;
    club: string;
    nclub: string;
    nom: string;
    sexe: string;
    echelon: string | null; /* Vaut 'N' si dans équipe nationale */
    prenom: string;
    points: string;
    clast: string; /* pour xml_liste_joueur.php */
    place: number | null; /* Placement si classé dans les 1000 premiers français */
}