export class InvalidLienRencontre extends Error
{
    constructor (lienRencontre: string)
    {
        super(`Le lien '${lienRencontre}' pour les details de la rencontre n'est pas correct.`);
    }
}
