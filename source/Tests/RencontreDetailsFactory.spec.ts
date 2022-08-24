import { PointsEtSexeIntrouvableException } from "../Exception/PointsEtSexeIntrouvableException";
import { FFTTAPI } from "../FFTTAPI";
import { DynamicObj } from "../Model/DynamicObj.interface";
import { Joueur } from "../Model/Joueur";
import { PartieDetailsRencontreRaw } from "../Model/Raw/RencontreDetailsRaw.interface";
import { JoueurRencontre } from "../Model/Rencontre/JoueurRencontre";
import { PartieRencontre } from "../Model/Rencontre/PartieRencontre";
import { RencontreDetailsFactory } from "../Service/RencontreDetailsFactory.service"

describe('RencontreDetailsFactory service', () => {

    let id: string = process.env.ID_SECRET ?? '';
    let password: string = process.env.PASSWORD_SECRET ?? '';
    let rencontreDetailsFactory: RencontreDetailsFactory = new RencontreDetailsFactory(new FFTTAPI(id, password));

    test('getParties should return empty parties', () => {
        let partieDetailsRencontreRaw: PartieDetailsRencontreRaw[] = [];
        let expectedPartieDetailsRencontre: PartieRencontre[] = [];
        const rencontreDetailsFactoryProto = Object.getPrototypeOf(rencontreDetailsFactory);
        expect(rencontreDetailsFactoryProto.getParties(partieDetailsRencontreRaw)).toEqual(expectedPartieDetailsRencontre)
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
        const rencontreDetailsFactoryProto = Object.getPrototypeOf(rencontreDetailsFactory);
        expect(rencontreDetailsFactoryProto.getParties(partieDetailsRencontreRaw)).toEqual(expectedPartieDetailsRencontre)
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
        const rencontreDetailsFactoryProto = Object.getPrototypeOf(rencontreDetailsFactory);
        expect(rencontreDetailsFactoryProto.getParties(partieDetailsRencontreRaw)).toEqual(expectedPartieDetailsRencontre)
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
        
        const rencontreDetailsFactoryProto = Object.getPrototypeOf(rencontreDetailsFactory);
        expect(rencontreDetailsFactoryProto.formatJoueur('Vincent', 'THOMAS', 'H 1112pts', joueursClub)).toEqual(expectedJoueur)
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
        const rencontreDetailsFactoryProto = Object.getPrototypeOf(rencontreDetailsFactory);
        expect(rencontreDetailsFactoryProto.formatJoueur('Vincent', 'THOMAS', 'N.9- H 1112pts', joueursClub)).toEqual(expectedJoueur)
    })
    
    test('formatJoueur should return empty JoueurRencontre (sexeEtPoints mal formatté)', () => {
        let joueursClub: Joueur[] = [{
            club: 'LA FRETTE',
            clubId: '128731',
            licence: '9529825',
            prenom: 'Vincent',
            nom: 'THOMAS',
            echelon: 'H',
            place: 12,
        }];
        const rencontreDetailsFactoryProto = Object.getPrototypeOf(rencontreDetailsFactory);
        jest.spyOn(rencontreDetailsFactoryProto, 'formatJoueur').mockRejectedValue(new PointsEtSexeIntrouvableException('regex qui fail'));
        expect(rencontreDetailsFactoryProto.formatJoueur('Vincent', 'THOMAS', 'regex qui fail', joueursClub)).rejects.toThrow(`Impossible d'extraire le sexe et les points dans 'regex qui fail'`)
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
        const rencontreDetailsFactoryProto = Object.getPrototypeOf(rencontreDetailsFactory);
        expect(rencontreDetailsFactoryProto.formatJoueur('Vincent', 'THOMAS', 'H 1234pts', joueursClub)).toEqual(expectedJoueur)
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
        const rencontreDetailsFactoryProto = Object.getPrototypeOf(rencontreDetailsFactory);
        expect(rencontreDetailsFactoryProto.formatJoueur('Absent', '', '', joueursClub)).toEqual(expectedJoueur)
    })

    test('formatJoueur should return empty JoueurRencontre (joueur Absent)', () => {
        let inputJoueur: string[][] = [
            ['Louise VINCE', '25376'],
            ['Vincent THOMAS', '2453535']
        ];

        let tmpJoueur: JoueurRencontre = {
            licence: '2453535',
            nom: 'THOMAS',
            points: 1234,
            prenom: 'Vincent',
            sexe: 'H'
        };
        let expectedJoueurs: DynamicObj = {
            'Vincent THOMAS': tmpJoueur,
            nom: '',
            points: null,
            prenom: 'Absent',
            sexe: null
        };
        
        const rencontreDetailsFactoryProto = Object.getPrototypeOf(rencontreDetailsFactory);
        expect(rencontreDetailsFactoryProto.formatJoueurs(inputJoueur, '08951331')).toEqual(expectedJoueurs)
    })
})
