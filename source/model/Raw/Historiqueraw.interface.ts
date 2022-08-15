export interface HistoriqueRaw {
    echelon: string | null; /* Vaut 'N' si dans équipe nationale */
    place: number | null; /* Placement si classé dans les 1000 premiers français */;
    saison: string;
    phase: number;
    point: number;
}