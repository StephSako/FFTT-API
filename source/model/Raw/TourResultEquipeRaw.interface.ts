export interface TourResultEquipeRaw {
    libelle: string;
    lien: string;
    equa: string;
    equb: string;
    scorea: number | null;
    scoreb: number | null;
    dateprevue: string; // Format 'd/m/Y
    datereelle: string; // Format 'd/m/Y
}