export class Organisme {
    libelle: string;
    id: number;
    code: string;
    idpere: number;

    constructor (
        libelle: string,
        id: number,
        code: string,
        idpere: number)
    {
        this.libelle = libelle;
        this.id = id;
        this.code = code;
        this.idpere = idpere;
    }
}