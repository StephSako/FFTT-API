export class Organisme {
    libelle: string;
    id: number;
    code: string;
    idPere: number;

    constructor (
        libelle: string,
        id: number,
        code: string,
        idPere: number)
    {
        this.libelle = libelle;
        this.id = id;
        this.code = code;
        this.idPere = idPere;
    }
}