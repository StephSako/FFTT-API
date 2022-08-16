export class NoFFTTResponseException extends Error
{
    constructor (uri: string)
    {
        super(`L'appel à l'adresse '${uri}' n'a retourné aucune réponse.`);
    }
}
