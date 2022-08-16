export class InvalidCredidentials extends Error
{
    constructor ()
    {
        super('Identifiant ou mot de passe incorrect.');
    }
}
