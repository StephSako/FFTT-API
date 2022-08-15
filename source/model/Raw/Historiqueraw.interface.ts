export interface HistoriqueRaw {
    echelon?: string; /* Vaut 'N' si dans équipe nationale */
    place?: number; /* Placement si classé dans les 1000 premiers français */;
    saison: string;
    phase: number;
    point: number;
}