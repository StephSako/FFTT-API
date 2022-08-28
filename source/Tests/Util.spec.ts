import { Equipe } from "../Model/Equipe";
import { Utils } from "../Service/Utils.service"

describe('Util service', () => {

    test('createDate should return Date(01/01/2000)', () => {
        const date = new Date('2000/01/01');
        expect(date).toEqual(Utils.createDate('01/01/2000'))
    })

    test('getPreviousMonthsMonth should return 8 for 15/09/2000', () => {
        const mockDate = new Date('2001/09/15');
        jest.spyOn(global, "Date").mockImplementation(() => (mockDate as unknown) as string);
        expect(Utils.getPreviousMonthsMonth()).toEqual(8)
    })

    test('getPreviousMonthsMonth should return 12 for 15/01/2001', () => {
        const mockDate = new Date('2001/01/15');
        jest.spyOn(global, "Date").mockImplementation(() => (mockDate as unknown) as string);
        expect(Utils.getPreviousMonthsMonth()).toEqual(12)
    })
    
    test('getPreviousMonthsMonth should return 11 for 15/12/2000', () => {
        const mockDate = new Date('2000/12/15');
        jest.spyOn(global, "Date").mockImplementation(() => (mockDate as unknown) as string);
        expect(Utils.getPreviousMonthsMonth()).toEqual(11)
    })

    test('getPreviousMonthsYear should return 1999 for 01/01/2000', () => {
        const mockDate = new Date('2000/01/01');
        jest.spyOn(global, "Date").mockImplementation(() => (mockDate as unknown) as string);
        expect(Utils.getPreviousMonthsYear()).toEqual(1999)
    })
    
    test('getPreviousMonthsYear should return 2000 for 01/02/2000', () => {
        const mockDate = new Date('2000/02/01');
        jest.spyOn(global, "Date").mockImplementation(() => (mockDate as unknown) as string);
        expect(Utils.getPreviousMonthsYear()).toEqual(2000)
    })

    test('round should return rounded numbers with a precision of 0.1', () => {
        expect(Utils.round(0.01)).toEqual(0)
        expect(Utils.round(0.045)).toEqual(0)
        expect(Utils.round(0.04)).toEqual(0)
        expect(Utils.round(0.05)).toEqual(0.1)
        expect(Utils.round(0.09)).toEqual(0.1)
        expect(Utils.round(0.145)).toEqual(0.1)
        expect(Utils.round(0.15)).toEqual(0.2)
        expect(Utils.round(0.94)).toEqual(0.9)
        expect(Utils.round(0.95)).toEqual(1)
        expect(Utils.round(0.99)).toEqual(1)
        expect(Utils.round(0.959)).toEqual(1)
        expect(Utils.round(0.999)).toEqual(1)
    })

    test('createStringDateToFormat should return 24/09/2022 for Date(2022/09/24)', () => {
        const dateMock: Date = new Date('2022/09/24');
        expect(Utils.createStringDateToFormat(dateMock)).toBe('24/09/2022')
    })
    
    test('createDate should return Date(2022/09/24) for 24/09/2022', () => {
        const dateMock: Date = new Date('2022/09/24');
        expect(Utils.createDate('24/09/2022')).toEqual(dateMock)
    })
    
    test('createDate should return true for null', () => {
        expect(Utils.isset(null)).toEqual(false)
    })
    
    test('createDate should return true for undefined', () => {
        expect(Utils.isset(undefined)).toEqual(false)
    })
    
    test('createDate should return true for abcd', () => {
        expect(Utils.isset('abcd')).toEqual(true)
    })
    
    test('wrappedArrayIfUnique should return [test , test] for [test, test]', () => {
        let realArray = ['test', 'test']
        expect(Utils.wrappedArrayIfUnique(realArray)).toEqual(realArray)
    })
    
    test('wrappedArrayIfUnique should return [test] for test', () => {
        let falseArray = 'test';
        expect(Utils.wrappedArrayIfUnique(falseArray)).toEqual([falseArray])
    
    })

    test('wrappedArrayIfUnique should return [] for null', () => {
        expect(Utils.wrappedArrayIfUnique(null)).toEqual([])
    })
    
    test('wrappedArrayIfUnique should return undefined for undefined', () => {
        expect(Utils.wrappedArrayIfUnique(undefined)).toEqual([])
    })
    
    test('removeAccentLowerCaseRegex should return j.r.MY for j?r?my', () => {
        expect(Utils.removeAccentLowerCaseRegex('j?r?MY')).toEqual('j.r.my')
    })
    
    test('removeAccentLowerCaseRegex should return âêîô.ûçÇÀ.ÉÈÙÏ.ÖÜÄËé.èà for âêîôûçÇÀÉÈÙÏÖÜÄË', () => {
        expect(Utils.removeAccentLowerCaseRegex('âêîô?ûçÇÀ?ÉÈÙÏ?ÖÜÄËé?èà')).toEqual('aeio.ucca.eeui.ouaee.ea')
    })

    test('extractNomEquipe should return LA FRETTE for LA FRETTE - 2', () => {
        let equipeMock: Equipe = {
            division: 'PR',
            idEpreuve: 12,
            idEquipe: 3456,
            libelle: 'LA FRETTE - 2',
            libelleEpreuve: 'CHAMPIONNAT DE PARIS',
            lienDivision: 'lienDivision'
        }
        expect(Utils.extractNomEquipe(equipeMock)).toEqual('LA FRETTE')
    })

    test('extractNomEquipe should return LA FRETTE for LA FRETTE', () => {
        let equipeMock: Equipe = {
            division: 'PR',
            idEpreuve: 12,
            idEquipe: 3456,
            libelle: 'LA FRETTE',
            libelleEpreuve: 'CHAMPIONNAT DE PARIS',
            lienDivision: 'lienDivision'
        }
        expect(Utils.extractNomEquipe(equipeMock)).toEqual('LA FRETTE')
    })

    test('extractNomEquipe should return CHALAIS - MONTMOREAU - 3 for CHALAIS - MONTMOREAU - 3', () => {
        let equipeMock: Equipe = {
            division: 'PR',
            idEpreuve: 12,
            idEquipe: 3456,
            libelle: 'CHALAIS - MONTMOREAU - 3',
            libelleEpreuve: 'CHAMPIONNAT DE PARIS',
            lienDivision: 'lienDivision'
        }
        expect(Utils.extractNomEquipe(equipeMock)).toEqual('CHALAIS - MONTMOREAU - 3')
    })

    test('formatPoints should return 1234 for H - 1234', () => {
        expect(Utils.formatPoints('H - 1234')).toEqual(1234)
    })
    
    test('formatPoints should return 1234 for 1234', () => {
        expect(Utils.formatPoints('1234')).toEqual(1234)
    })
    
    test('returnNomPrenom should return [DA COSTA TEIXEIR, Ana] for DA COSTA TEIXEIRA Ana', () => {
        expect(Utils.returnNomPrenom('DA COSTA TEIXEIRA Ana')).toEqual(['DA COSTA TEIXEIRA', 'Ana'])
    })

    test('returnNomPrenom should return [DA COSTÉ TEIXEIRA, André] for DA COSTÉ TEIXEIRA André', () => {
        expect(Utils.returnNomPrenom('DA COSTÉ TEIXEIRA André')).toEqual(['DA COSTÉ TEIXEIRA', 'André'])
    })

    test('returnNomPrenom should return [ABBAS, Abdel-Jalil] for ABBAS Abdel-Jalil', () => {
        expect(Utils.returnNomPrenom('ABBAS Abdel-Jalil')).toEqual(['ABBAS', 'Abdel-Jalil'])
    })
    
    test('returnStringOrNull should return null for "" ', () => {
        expect(Utils.returnStringOrNull('')).toEqual(null)
    })
    
    test('returnStringOrNull should return "value" for "value"', () => {
        expect(Utils.returnStringOrNull('value')).toEqual('value')
    })
    
    test('returnNumberOrNull should return null for "" ', () => {
        expect(Utils.returnNumberOrNull('')).toEqual(null)
    })
    
    test('returnNumberOrNull should return 3 for "3"', () => {
        expect(Utils.returnNumberOrNull('3')).toEqual(3)
    })
})
