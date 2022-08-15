export class VirtualPoints {
    seasonlyPointsWon: number;
    monthlyPointsWon: number;
    virtualPoints: number;

    constructor (
        monthlyPointsWon: number,
        virtualPoints: number,
        seasonlyPointsWon: number)
    {
        this.monthlyPointsWon = monthlyPointsWon;
        this.virtualPoints = virtualPoints;
        this.seasonlyPointsWon = seasonlyPointsWon;
    }
}