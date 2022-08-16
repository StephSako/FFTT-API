export class URIPartNotValidException extends Error
{
    constructor (uri: string)
    {
        super(`La FFTT ne donne pas d'informations pour l'argument '${uri}'.`);
    }
}
