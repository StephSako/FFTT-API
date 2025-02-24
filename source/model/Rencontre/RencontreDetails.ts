import { DynamicObj } from "../DynamicObj.interface";
import { JoueurRencontre } from "./JoueurRencontre";
import { PartieRencontre } from "./PartieRencontre";

export class RencontreDetails {
    nomEquipeA: string;
    nomEquipeB: string;
    scoreEquipeA: number;
    scoreEquipeB: number;
    joueursA: DynamicObj; // TODO JoueurRencontre[];
    joueursB: DynamicObj; // TODO JoueurRencontre[];
    parties: PartieRencontre[];
    expectedScoreEquipeA: number;
    expectedScoreEquipeB: number;

    constructor (
        nomEquipeA: string,
        nomEquipeB: string,
        scoreEquipeA: number,
        scoreEquipeB: number,
        joueursA: DynamicObj,
        joueursB: DynamicObj,
        parties: PartieRencontre[],
        expectedScoreEquipeA: number,
        expectedScoreEquipeB: number
    )
    {
        this.nomEquipeA = nomEquipeA;
        this.nomEquipeB = nomEquipeB;
        this.scoreEquipeA = scoreEquipeA;
        this.scoreEquipeB = scoreEquipeB;
        this.joueursA = joueursA;
        this.joueursB = joueursB;
        this.parties = parties;
        this.expectedScoreEquipeA = expectedScoreEquipeA;
        this.expectedScoreEquipeB = expectedScoreEquipeB;
    }
}

export class ResutatDetailsRencontre {
    equipeA: string;
    equipeB: string;
    resultatEquipeA: any; // TODO
    resultatEquipeB: any; // TODO

    constructor (
        equipeA: string,
        equipeB: string,
        resultatEquipeA: any, // TODO
        resultatEquipeB: any // TODO
    ) {
        this.equipeA = equipeA;
        this.equipeB = equipeB;
        this.resultatEquipeA = resultatEquipeA;
        this.resultatEquipeB = resultatEquipeB;
    }
}

export class JoueurDetailsRencontre {
    libellejoueurA: string;
    libellejoueurB: string;
    classementJoueurA: number;
    classementJoueurB: number;

    constructor (
        libellejoueurA: string,
        libellejoueurB: string,
        classementJoueurA: number,
        classementJoueurB: number
    ) {
        this.libellejoueurA = libellejoueurA;
        this.libellejoueurB = libellejoueurB;
        this.classementJoueurA = classementJoueurA;
        this.classementJoueurB = classementJoueurB;
    }
}

export class PartieDetailsRencontre {
    nomPrenomJoueurA: string; // Nom Prénom du joueur A
    nomPrenomJoueurB: string; // Nom Prénom du joueur A
    scoreJoueurA: number;
    scoreJoueurB: number;

    constructor (
        nomPrenomJoueurA: string,
        nomPrenomJoueurB: string,
        scoreJoueurA: number,
        scoreJoueurB: number
    ) {
        this.nomPrenomJoueurA = nomPrenomJoueurA;
        this.nomPrenomJoueurB = nomPrenomJoueurB;
        this.scoreJoueurA = scoreJoueurA;
        this.scoreJoueurB = scoreJoueurB;
    }
}