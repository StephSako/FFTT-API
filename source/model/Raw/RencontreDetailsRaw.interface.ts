export interface ResutatDetailsRencontreRaw {
    equa: string;
    equb: string;
    resa: string; // TODO type + Array.isArray dans createFromArray
    resb: string; // TODO type
}

export interface JoueurDetailsRencontreRaw {
    xja: string; // Libelle du joueur A
    xjb: string; // Libelle du joueur B
    xca: string; // Classement du joueur B
    xcb: string; // Classement du joueur B
}

export interface PartieDetailsRencontreRaw {
    ja: string | null; // Nom Prénom du joueur A
    jb: string | null; // Nom Prénom du joueur A
    scorea: string;
    scoreb: string;
    detail: string; // TODO A VERIFIER
}

export interface RencontreDetailsRaw {
    resultat: ResutatDetailsRencontreRaw;
    joueur: JoueurDetailsRencontreRaw[];
    partie: PartieDetailsRencontreRaw[];
}