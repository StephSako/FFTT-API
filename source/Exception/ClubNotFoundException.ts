export class ClubNotFoundException extends Error
{
    constructor (club: string)
    {
        super(`Le club '${club}' n'existe pas.`);
    }
}
