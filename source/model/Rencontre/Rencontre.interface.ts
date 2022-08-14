export interface Rencontre {
    libelle: string;
    nomEquipeA: string;
    clubEquipeA: string;
    nomEquipeB: string;
    clubEquipeB: string;
    scoreEquipeA: number;
    scoreEquipeB: number;
    lien: string;
    datePrevue: Date;
    dateReelle?: Date;
}