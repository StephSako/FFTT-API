const VICTORY_POINTS = {
    '-500': 40,
    '-401': 28,
    '-310': 22,
    '-201': 17,
    '-151': 13,
    '-101': 10,
    '-51': 8,
    '-26': 7,
    '-1': 6,
    '24': 6,
    '49': 5.5,
    '99': 5,
    '149': 4,
    '199': 3,
    '299': 2,
    '399': 1,
    '499': 0.5,
    '500': 0
}

const DEFEAT_POINTS = {
    '-401': 0,
    '-310': -0.5,
    '-201': -1,
    '-151': -2,
    '-101': -3,
    '-51': -4,
    '-26': -4.5,
    '-1': -5,
    '24': -5,
    '49': -6,
    '99': -7,
    '149': -8,
    '199': -10,
    '299': -12.5,
    '399': -16,
    '499': -20,
    '500': -29
}

type ObjectKeyDefeat = keyof typeof DEFEAT_POINTS;
type ObjectKeyVictory = keyof typeof VICTORY_POINTS;

export class PointCalculator
{
    public static getPointDefeat(joueurPoints: number, adversairePoints: number): number {
        let calculatedDiff = joueurPoints - adversairePoints;
        let diffs: number[] = Object.keys(DEFEAT_POINTS).map(Number).sort((n1: number, n2: number) => Number(n1) - Number(n2));
        let diffKeys: number[] = diffs.filter((diff: number) => calculatedDiff <= diff);
        let diffKey = (diffKeys.length ? diffKeys[0].toString() : null) as ObjectKeyDefeat;
        return diffKey ? DEFEAT_POINTS[diffKey] : Math.min(...Object.values(DEFEAT_POINTS));
    }

    public static getPointVictory(joueurPoints: number, adversairePoints: number): number {
        let calculatedDiff = joueurPoints - adversairePoints;
        let diffs: number[] = Object.keys(VICTORY_POINTS).map(Number).sort((n1: number, n2: number) => Number(n1) - Number(n2));
        let diffKeys: number[] = diffs.filter((diff: number) => calculatedDiff <= diff);
        let diffKey = (diffKeys.length ? diffKeys[0].toString() : null) as ObjectKeyVictory;
        return diffKey ? VICTORY_POINTS[diffKey] : Math.min(...Object.values(VICTORY_POINTS));
    }
}
