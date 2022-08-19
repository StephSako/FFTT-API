export interface ResutatDetailsRencontreRaw {
    equa: string;
    equb: string;
    resa: any[]; // TODO
    resb: any[]; // TODO
}

export interface JoueurDetailsRencontreRaw {
    xja: string; // Libelle du joueur A
    xjb: string; // Libelle du joueur B
    xca: number; // Classement du joueur B
    xcb: number; // Classement du joueur B
}

export interface PartieDetailsRencontreRaw {
    ja: string; // Nom Prénom du joueur A
    jb: string; // Nom Prénom du joueur A
    scorea: string;
    scoreb: string;
    detail: string; // TODO A VERIFIER
}

export interface RencontreDetailsRaw {
    resultat: ResutatDetailsRencontreRaw;
    joueur: JoueurDetailsRencontreRaw[];
    partie: PartieDetailsRencontreRaw[];
}