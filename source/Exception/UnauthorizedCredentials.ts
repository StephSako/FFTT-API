import xml2js from 'xml2js';

export class UnauthorizedCredentials extends Error
{
    constructor (uri: string, erreur: string)
    {
        super(`Non autorisé pour l'URL : '${uri}', message retourné : '${erreur}'.`);
    }
}
