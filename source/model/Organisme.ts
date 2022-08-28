export class Organisme {
    libelle: string;
    id: number;
    code: string;
    idPere: number | null;

    constructor (
        libelle: string,
        id: string,
        code: string,
        idPere: string
    )
    {
        this.libelle = libelle;
        this.id = Number(id);
        this.code = code;
        this.idPere = idPere ? Number(idPere) : null;
    }
}