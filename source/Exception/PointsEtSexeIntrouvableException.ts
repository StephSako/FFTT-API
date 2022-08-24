export class PointsEtSexeIntrouvableException extends Error
{
    constructor (sexeEtPoints: string)
    {
        super(`Impossible d'extraire le sexe et les points dans '${sexeEtPoints}'`);
    }
}
