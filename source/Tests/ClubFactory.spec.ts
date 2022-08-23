import { Club } from "../Model/Club"
import { ClubRaw } from "../Model/Raw/ClubRaw.interface"
import { ClubFactory } from "../Service/ClubFactory.service"

describe('ClubFactory service', () => {

    test('createClubFromArray should return only one Equipe', () => {
        let expectedClubs: Club = {
            dateValidation: new Date('2022/09/01'),
            idClub: '1245',
            nom: 'ESFTT',
            numero: '08951331',
            typeClub: 'H'
        }
        let clubsRaw: ClubRaw[] = [{
            idclub: '1245',
            nom: 'ESFTT',
            numero: '08951331',
            typeclub: 'H',
            validation: '01/09/2022'
        }]

        expect(ClubFactory.createClubFromArray(clubsRaw)).toEqual(expectedClubs)
    })
    
    test('createClubFromArray should return only one Equipe without validation date', () => {
        let expectedClubs: Club = {
            dateValidation: null,
            idClub: '1245',
            nom: 'ESFTT',
            numero: '08951331',
            typeClub: 'H'
        }
        let clubsRaw: ClubRaw[] = [{
            idclub: '1245',
            nom: 'ESFTT',
            numero: '08951331',
            typeclub: 'H',
            validation: null
        }]

        expect(ClubFactory.createClubFromArray(clubsRaw)).toEqual(expectedClubs)
    })
    
    test('createClubFromArray should return two Equipes', () => {
        let expectedClubs: Club[] = [{
            dateValidation: new Date('2022/09/01'),
            idClub: '1245',
            nom: 'ESFTT',
            numero: '08951331',
            typeClub: 'H'
        }, 
        {
            dateValidation: new Date('2022/08/22'),
            idClub: '5421',
            nom: 'HERBLAY',
            numero: '08950102',
            typeClub: 'F'
        }]
        let clubsRaw: ClubRaw[] = [{
            idclub: '1245',
            nom: 'ESFTT',
            numero: '08951331',
            typeclub: 'H',
            validation: '01/09/2022'
        },
        {
            validation: '22/08/2022',
            idclub: '5421',
            nom: 'HERBLAY',
            numero: '08950102',
            typeclub: 'F'
        }]

        expect(ClubFactory.createClubFromArray(clubsRaw)).toEqual(expectedClubs)
    })
})
