export class PartieRencontre {
    adversaireA: string;
    adversaireB: string;
    scoreA: number;
    scoreB: number;
    setDetails: string[]

    constructor (
        adversaireA: string,
        adversaireB: string,
        scoreA: number,
        scoreB: number,
        setDetails: string[]
    ) {
        this.adversaireA = adversaireA;
        this.adversaireB = adversaireB;
        this.scoreA = scoreA;
        this.scoreB = scoreB;
        this.setDetails = setDetails;
    }
}