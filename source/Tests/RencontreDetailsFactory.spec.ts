import { PointsEtSexeIntrouvableException } from "../Exception/PointsEtSexeIntrouvableException";
import { FFTTAPI } from "../FFTTAPI";
import { DynamicObj } from "../Model/DynamicObj.interface";
import { Joueur } from "../Model/Joueur";
import { PartieDetailsRencontreRaw } from "../Model/Raw/RencontreDetailsRaw.interface";
import { JoueurRencontre } from "../Model/Rencontre/JoueurRencontre";
import { PartieRencontre } from "../Model/Rencontre/PartieRencontre";
import { ExpectedPoints, Scores } from "../Model/ScoreEtPoints.interface";
import { RencontreDetailsFactory } from "../Service/RencontreDetailsFactory.service"

describe('RencontreDetailsFactory service', () => {
    const id: string = process.env.ID_SECRET ?? '';
    const password: string = process.env.PASSWORD_SECRET ?? '';
    const mockFFTTAPI: FFTTAPI = new FFTTAPI(id, password);
    const rencontreDetailsFactory: RencontreDetailsFactory = new RencontreDetailsFactory(mockFFTTAPI);

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('getParties should return empty parties', () => {
        let partieDetailsRencontreRaw: PartieDetailsRencontreRaw[] = [];
        let expectedPartieDetailsRencontre: PartieRencontre[] = [];
        expect(rencontreDetailsFactory.getParties(partieDetailsRencontreRaw)).toEqual(expectedPartieDetailsRencontre)
    })

    test('getParties should return formatted parties', () => {
        let partieDetailsRencontreRaw: PartieDetailsRencontreRaw[] = [{
            detail: 'details de la partie',
            ja: 'JEAN PIERRE',
            jb: 'SAM TUDOR',
            scorea: '12',
            scoreb: '10'
        }];

        let expectedPartieDetailsRencontre: PartieRencontre[] = [{
            adversaireA: 'JEAN PIERRE',
            adversaireB: 'SAM TUDOR',
            scoreA: 12,
            scoreB: 10,
            setDetails: ['details', 'de', 'la', 'partie']
        }];

        expect(rencontreDetailsFactory.getParties(partieDetailsRencontreRaw)).toEqual(expectedPartieDetailsRencontre)
    })
    
    test('getParties should return formatted parties without names and scores', () => {
        let partieDetailsRencontreRaw: PartieDetailsRencontreRaw[] = [{
            detail: 'details de la partie',
            ja: null,
            jb: null,
            scorea: '-',
            scoreb: '-'
        }];

        let expectedPartieDetailsRencontre: PartieRencontre[] = [{
            adversaireA: 'Absent Absent',
            adversaireB: 'Absent Absent',
            scoreA: 0,
            scoreB: 0,
            setDetails: ['details', 'de', 'la', 'partie']
        }];

        expect(rencontreDetailsFactory.getParties(partieDetailsRencontreRaw)).toEqual(expectedPartieDetailsRencontre)
    })

    test('formatJoueur should return formatted pJoueurRencontre', () => {
        let joueursClub: Joueur[] = [{
            club: 'LA FRETTE',
            clubId: '128731',
            licence: '9529825',
            prenom: 'Vincent',
            nom: 'THOMAS',
            classementOfficiel: '11',
            echelon: 'H',
            isHomme: true,
            place: 12,
            points: 1112
        }];

        let expectedJoueur: JoueurRencontre = {
            licence: '9529825',
            nom: 'THOMAS',
            points: 1112,
            prenom: 'Vincent',
            sexe: 'H'
        };
        
        expect(rencontreDetailsFactory.formatJoueur('Vincent', 'THOMAS', 'H 1112pts', joueursClub)).toEqual(expectedJoueur)
    })
    
    test('formatJoueur should return formatted JoueurRencontre (joueur numéroté)', () => {
        let joueursClub: Joueur[] = [{
            club: 'LA FRETTE',
            clubId: '128731',
            licence: '9529825',
            prenom: 'Vincent',
            nom: 'THOMAS',
            classementOfficiel: '11',
            echelon: 'H',
            isHomme: true,
            place: 12,
            points: 1112
        }];

        let expectedJoueur: JoueurRencontre = {
            licence: '9529825',
            nom: 'THOMAS',
            points: 1112,
            prenom: 'Vincent',
            sexe: 'H'
        };

        expect(rencontreDetailsFactory.formatJoueur('Vincent', 'THOMAS', 'N.9- H 1112pts', joueursClub)).toEqual(expectedJoueur)
    })
    
    test('formatJoueur should throw PointsEtSexeIntrouvableException (sexeEtPoints mal formatté)', () => {
        let joueursClub: Joueur[] = [{
            club: 'LA FRETTE',
            clubId: '128731',
            licence: '9529825',
            prenom: 'Vincent',
            nom: 'THOMAS',
            echelon: 'H',
            place: 12,
        }];

        jest.spyOn(rencontreDetailsFactory, 'formatJoueur').mockImplementation(() => { throw new PointsEtSexeIntrouvableException('regex qui fail') });
        expect(() => rencontreDetailsFactory.formatJoueur('Vincent', 'THOMAS', 'regex qui fail', joueursClub)).toThrow(PointsEtSexeIntrouvableException);
    })

    test('formatJoueur should return empty JoueurRencontre (joueur non trouvé dans la liste)', () => {
        let joueursClub: Joueur[] = [{
            club: 'LCOURBEVOIE',
            clubId: '632679',
            licence: '74736979',
            prenom: 'Eloïse',
            nom: 'CARRIERE',
            echelon: 'F',
            place: 15,
        }];

        let expectedJoueur: JoueurRencontre = {
            licence: '',
            nom: 'THOMAS',
            points: null,
            prenom: 'Vincent',
            sexe: null
        };

        expect(rencontreDetailsFactory.formatJoueur('Vincent', 'THOMAS', 'H 1234pts', joueursClub)).toEqual(expectedJoueur)
    })

    test('formatJoueur should return empty JoueurRencontre (joueur Absent)', () => {
        let joueursClub: Joueur[] = [{
            club: 'COURBEVOIE',
            clubId: '632679',
            licence: '74736979',
            prenom: 'Eloïse',
            nom: 'CARRIERE',
            echelon: 'F',
            place: 15,
        }];

        let expectedJoueur: JoueurRencontre = {
            licence: '',
            nom: '',
            points: null,
            prenom: 'Absent',
            sexe: null
        };

        expect(rencontreDetailsFactory.formatJoueur('Absent', '', '', joueursClub)).toEqual(expectedJoueur)
    })

    test('formatJoueur should return formatted joueurs', async () => {
        let inputJoueur: Array<Array<string>> = [
            ['Louise LIRE', 'F 1234pts'],
            ['Vincent TEXT', 'H 4321pts']
        ];

        let expectedJoueurs: DynamicObj = {
            'Louise LIRE': {
              nom: 'LIRE',
              prenom: 'Louise',
              licence: '2537634',
              points: 1234,
              sexe: "F"
            },
            'Vincent TEXT': {
              nom: 'TEXT',
              prenom: 'Vincent',
              licence: '2453535',
              points: 4321,
              sexe: "H"
            }
        };

        let joueursPromiseResult: Promise<Joueur[]> = Promise.resolve([
            new Joueur('2537634', '26369', 'LA FRETTE', 'LIRE', 'Louise', 1234, false, '12', null, null),
            new Joueur('2453535', '26369', 'LA FRETTE', 'TEXT', 'Vincent', 4321, false, '43', null, null)
        ])
        jest.spyOn(mockFFTTAPI, 'getJoueursByClub').mockReturnValue(joueursPromiseResult);
        let joueurs: DynamicObj = await rencontreDetailsFactory.formatJoueurs(inputJoueur, '08951331');
        expect(joueurs).toEqual(expectedJoueurs)
    })

    test('getScores should return scores of all parties', () => {
        let partiesRencontre: PartieRencontre[] = [
            new PartieRencontre('Théo LEROUX', 'Michel HIRTH', 33, 11, ['MATCH', 'TERMINE']),
            new PartieRencontre('Louis LEBLANC', 'Patrick FANZUTTI', 8, 42, ['PARTIE', 'TERMINE']),
            new PartieRencontre('Louis LEBLANC', 'Patrick FANZUTTI', 2, 55, ['PARTIE', 'TERMINE'])
        ];
        let scores: Scores = {
            scoreA: 43,
            scoreB: 108
        }
        expect(rencontreDetailsFactory.getScores(partiesRencontre)).toEqual(scores)
    })
    
    test('getExpectedPoints should return expected points', () => {
        let partiesRencontre: PartieRencontre[] = [
            new PartieRencontre('Louise LIRE', 'Michel HIRTH', 33, 11, ['MATCH', 'TERMINE']),
            new PartieRencontre('Vincent TEXT', 'Patrick FANZUTTI', 8, 42, ['PARTIE', 'TERMINE']),
            new PartieRencontre('Cédric LE SOUDER', 'Jean BON', 8, 42, ['PARTIE', 'TERMINE']),
            new PartieRencontre('Rémy FRENCHE', 'Clarisse GESTIN', 8, 42, ['PARTIE', 'TERMINE']),
            new PartieRencontre('Absent Absent', 'Absent Absent', 0, 0, ['PARTIE', 'ANNULEE'])
        ];

        let joueursAFormatted: DynamicObj = {
            'Louise LIRE': {
              nom: 'LIRE',
              prenom: 'Louise',
              licence: '2537634',
              points: 501,
              sexe: "F"
            },
            'Vincent TEXT': {
              nom: 'TEXT',
              prenom: 'Vincent',
              licence: '2453535',
              points: 4321,
              sexe: "H"
            },
            'Cédric LE SOUDER': {
              nom: 'TEXT',
              prenom: 'Vincent',
              licence: '2453536',
              points: 500,
              sexe: "H"
            },
            'Rémy FRENCHE': {
              nom: 'TEXT',
              prenom: 'Vincent',
              licence: '2453537',
              points: 768,
              sexe: "H"
            }
        };

        let joueursBFormatted: DynamicObj = {
            'Michel HIRTH': {
              nom: 'LIRE',
              prenom: 'Louise',
              licence: '2537623',
              points: 678,
              sexe: "H"
            },
            'Patrick FANZUTTI': {
              nom: 'TEXT',
              prenom: 'Vincent',
              licence: '2453511',
              points: 564,
              sexe: "H"
            },
            'Jean BON': {
              nom: 'TEXT',
              prenom: 'Vincent',
              licence: '2453598',
              points: 500,
              sexe: "H"
            },
            'Clarisse GESTIN': {
              nom: 'TEXT',
              prenom: 'Vincent',
              licence: '2453500',
              points: 530,
              sexe: "F"
            }
        };

        let expectedpoints: ExpectedPoints = {
            expectedA: 3,
            expectedB: 2
        }

        expect(rencontreDetailsFactory.getExpectedPoints(partiesRencontre, joueursAFormatted, joueursBFormatted)).toEqual(expectedpoints)
    })
})


