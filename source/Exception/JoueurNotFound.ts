export class JoueurNotFound extends Error
{
    constructor (licenceId: string)
    {
        super(`Le joueur avec l'id '${licenceId}' n'existe pas.`);
    }
}
