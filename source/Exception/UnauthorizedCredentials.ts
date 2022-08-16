import xml2js from 'xml2js';

export class UnauthorizedCredentials extends Error
{
    constructor (uri: string, content: string)
    {
        // xml2js.parseString(content, { mergeAttrs: true, trim : true, explicitRoot : false, explicitArray : false }, (_err: any, result: any) => {
        //     super(`Non autorisé pour l'URL : '${uri}', message retourné : '${result.erreur}'.`);
        // });
    }
}
