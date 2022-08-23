import { PointCalculator } from "../Service/PointCalculator.service"

describe('PointCalculator service', () => {

    test('getPointDefeat should return 0 for 1112 et 1612', () => {
        expect(PointCalculator.getPointDefeat(1112, 1612)).toEqual(0)
    })
    
    test('getPointDefeat should return 0 for 1112 et 1700', () => {
        expect(PointCalculator.getPointDefeat(1112, 1700)).toEqual(0)
    })
    
    test('getPointDefeat should return -29 for 1112 et 612', () => {
        expect(PointCalculator.getPointDefeat(1112, 612)).toEqual(-29)
    })
    
    test('getPointDefeat should return -29 for 1112 et 600', () => {
        expect(PointCalculator.getPointDefeat(1112, 600)).toEqual(-29)
    })
    
    test('getPointDefeat should return -16 for 1112 et 812', () => {
        expect(PointCalculator.getPointDefeat(1112, 812)).toEqual(-16)
    })
    
    test('getPointDefeat should return -12.5 for 1112 et 912', () => {
        expect(PointCalculator.getPointDefeat(1112, 912)).toEqual(-12.5)
    })
    
    test('getPointDefeat should return -6 for 1112 et 1063', () => {
        expect(PointCalculator.getPointDefeat(1112, 1063)).toEqual(-6)
    })
    
    test('getPointDefeat should return -7 for 1112 et 1062', () => {
        expect(PointCalculator.getPointDefeat(1112, 1062)).toEqual(-7)
    })
    
    test('getPointDefeat should return -12.5 for 1112 et 813', () => {
        expect(PointCalculator.getPointDefeat(1112, 813)).toEqual(-12.5)
    })
    
    test('getPointDefeat should return -8 for 1112 et 980', () => {
        expect(PointCalculator.getPointDefeat(1112, 980)).toEqual(-8)
    })
    
    test('getPointDefeat should return 0 for 1112 et 1580', () => {
        expect(PointCalculator.getPointDefeat(1112, 1580)).toEqual(0)
    })
    
    test('getPointDefeat should return -20 for 1112 et 613', () => {
        expect(PointCalculator.getPointDefeat(1112, 613)).toEqual(-20)
    })
    
    test('getPointDefeat should return -29 for 1112 et -50000', () => {
        expect(PointCalculator.getPointDefeat(1112, -50000)).toEqual(-29)
    })
    
    test('getPointDefeat should return 0 for 1112 et 50000', () => {
        expect(PointCalculator.getPointDefeat(1112, 50000)).toEqual(0)
    })
    
    test('getPointVictory should return 8 for 1112 et 1170', () => {
        expect(PointCalculator.getPointVictory(1112, 1170)).toEqual(8)
    })
    
    test('getPointVictory should return 5 for 1112 et 1062', () => {
        expect(PointCalculator.getPointVictory(1112, 1062)).toEqual(5)
    })
    
    test('getPointVictory should return 5.5 for 1112 et 1063', () => {
        expect(PointCalculator.getPointVictory(1112, 1063)).toEqual(5.5)
    })
    
    test('getPointVictory should return 0 for 1112 et 612', () => {
        expect(PointCalculator.getPointVictory(1112, 612)).toEqual(0)
    })
    
    test('getPointVictory should return 0.5 for 1112 et 613', () => {
        expect(PointCalculator.getPointVictory(1112, 613)).toEqual(0.5)
    })
    
    test('getPointVictory should return 0 for 1112 et 600', () => {
        expect(PointCalculator.getPointVictory(1112, 600)).toEqual(0)
    })
    
    test('getPointVictory should return 3 for 1112 et 913', () => {
        expect(PointCalculator.getPointVictory(1112, 913)).toEqual(3)
    })
    
    test('getPointVictory should return 2 for 1112 et 813', () => {
        expect(PointCalculator.getPointVictory(1112, 813)).toEqual(2)
    })
    
    test('getPointVictory should return 2 for 1112 et 912', () => {
        expect(PointCalculator.getPointVictory(1112, 912)).toEqual(2)
    })
    
    test('getPointVictory should return 1 for 1112 et 811', () => {
        expect(PointCalculator.getPointVictory(1112, 811)).toEqual(1)
    })
    
    test('getPointVictory should return 40 for 1112 et 1611', () => {
        expect(PointCalculator.getPointVictory(1112, 1611)).toEqual(28)
    })
    
    test('getPointVictory should return 40 for 1112 et 1612', () => {
        expect(PointCalculator.getPointVictory(1112, 1612)).toEqual(40)
    })
    
    test('getPointVictory should return 40 for 1112 et 50000', () => {
        expect(PointCalculator.getPointVictory(1112, 50000)).toEqual(40)
    })
    
    test('getPointVictory should return 0 for 1112 et -50000', () => {
        expect(PointCalculator.getPointVictory(1112, -50000)).toEqual(0)
    })
})
