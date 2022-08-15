export class Classement {
    points: number;
    anciensPoints: number;
    classement: number;
    rangRegional: number;
    rangNational: number;
    rangDepartemental: number;
    pointsOfficiels: number;
    pointsInitials: number;
    date: Date;

    constructor (
        date: Date,
        points: number,
        anciensPoints: number,
        classement: number,
        rangNational: number,
        rangRegional: number,
        rangDepartemental: number,
        pointsOfficiels: number,
        pointsInitials: number
    )
    {
        this.date = date;
        this.points = points;
        this.anciensPoints = anciensPoints;
        this.classement = classement;
        this.rangNational = rangNational;
        this.rangRegional = rangRegional;
        this.rangDepartemental = rangDepartemental;
        this.pointsOfficiels = pointsOfficiels;
        this.pointsInitials = pointsInitials;
    }
}