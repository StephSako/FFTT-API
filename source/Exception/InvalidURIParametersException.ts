let httpBuildQuery = require('http-build-query');

export class InvalidURIParametersException extends Error

{
    constructor (uriPart: string, params: object)
    {
        super(`L'appel à l'adresse '${uriPart}' n'a pas eu tous les arguments nécessaires : '${httpBuildQuery(params, '', ', ')}'.`);
    }
}
