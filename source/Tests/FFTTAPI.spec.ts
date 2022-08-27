import axios from "axios";
import { FFTTAPI } from "../FFTTAPI"
import { Actualite } from "../Model/Actualite";
import { Organisme } from "../Model/Organisme";

describe('FFTTAPI class', () => {

    const id: string = process.env.ID_SECRET ?? '';
    const password: string = process.env.PASSWORD_SECRET ?? '';
    const mockFFTTAPI: FFTTAPI = new FFTTAPI(id, password);

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('getActualites should return only one actualité', async () => {
        let actualites: Actualite[] = [
            new Actualite(
                '2022-08-25',
                'Ping Santé-vous sport !',
                `En partenariat avec l'opération " Sentez-vous Sport " du CNOSF, la FFTT lance son Ping Santé-vous Sport.Cette première édition du " Ping...`,
                'https://www.fftt.com/site/actualites/2022-08-25/ping-sante-vous-sport',
                'https://www.fftt.com/site/medias/news/news__20220825134426.jpg',
                'Ping santé'
            )
        ]

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><news><date>2022-08-25</date><titre>Ping Santé-vous sport !</titre><description>En partenariat avec l'opération " Sentez-vous Sport " du CNOSF, la FFTT lance son Ping Santé-vous Sport.Cette première édition du " Ping...</description><url>https://www.fftt.com/site/actualites/2022-08-25/ping-sante-vous-sport</url><photo>https://www.fftt.com/site/medias/news/news__20220825134426.jpg</photo><categorie>Ping santé</categorie></news></liste>` }))
        
        let result: Actualite[] = await mockFFTTAPI.getActualites();
        
        expect(result).toEqual(actualites)
    })
    
    test('getActualites should return two actualités', async () => {
        let actualites: Actualite[] = [
            new Actualite(
                '2022-08-25',
                'Ping Santé-vous sport !',
                `En partenariat avec l'opération " Sentez-vous Sport " du CNOSF, la FFTT lance son Ping Santé-vous Sport.Cette première édition du " Ping...`,
                'https://www.fftt.com/site/actualites/2022-08-25/ping-sante-vous-sport',
                'https://www.fftt.com/site/medias/news/news__20220825134426.jpg',
                'Ping santé'
            ),
            new Actualite(
                '2022-08-18',
                'Les frères Lebrun médaillés de bronze en double messieurs',
                `EXCEPTIONNELS ! Alexis LEBRUN et Félix LEBRUN décrochent le bronze en double messieurs aux Championnats d'Europe individuels 2022. Après l'or et le titre de Jia Nan...`,
                'https://www.fftt.com/site/actualites/2022-08-18/les-freres-lebrun-medailles-de-bronze-en-double-messieurs',
                'https://www.fftt.com/site/medias/news/news__20220818150438.jpg',
                "Championnats d'Europe"
            )
        ]

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><news><date>2022-08-25</date><titre>Ping Santé-vous sport !</titre><description>En partenariat avec l'opération " Sentez-vous Sport " du CNOSF, la FFTT lance son Ping Santé-vous Sport.Cette première édition du " Ping...</description><url>https://www.fftt.com/site/actualites/2022-08-25/ping-sante-vous-sport</url><photo>https://www.fftt.com/site/medias/news/news__20220825134426.jpg</photo><categorie>Ping santé</categorie></news><news><date>2022-08-18</date><titre>Les frères Lebrun médaillés de bronze en double messieurs</titre><description>EXCEPTIONNELS ! Alexis LEBRUN et Félix LEBRUN décrochent le bronze en double messieurs aux Championnats d'Europe individuels 2022. Après l'or et le titre de Jia Nan...</description><url>https://www.fftt.com/site/actualites/2022-08-18/les-freres-lebrun-medailles-de-bronze-en-double-messieurs</url><photo>https://www.fftt.com/site/medias/news/news__20220818150438.jpg</photo><categorie>Championnats d'Europe</categorie></news></liste>` }))
        
        let result: Actualite[] = await mockFFTTAPI.getActualites();
        
        expect(result).toEqual(actualites)
    })

    // test('getOrganismes should return only one organisme', async () => {
    //     let organismes: Organisme = new Organisme(
    //         'ZONE 1 (CVL-IDF)',
    //         '8',
    //         'Z01',
    //         '1'
    //     )

    //     jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><organisme><libelle>ZONE 1 (CVL-IDF)</libelle><id>8</id><code>Z01</code><idPere>1</idPere></organisme></liste>` }))
        
    //     let result: Organisme[] = await mockFFTTAPI.getOrganismes();
        
    //     expect(result).toEqual(organismes)
    // })
    
    test('getOrganismes should return two organismes', async () => {
        let organismes: Organisme[] = [
            new Organisme(
                'ZONE 1 (CVL-IDF)',
                '8',
                'Z01',
                '1'
            ),
            new Organisme(
                'ZONE 2 (BR-PDL)',
                '7',
                'Z02',
                '1'
            )
        ]

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><organisme><libelle>ZONE 1 (CVL-IDF)</libelle><id>8</id><code>Z01</code><idPere>1</idPere></organisme><organisme><libelle>ZONE 2 (BR-PDL)</libelle><id>7</id><code>Z02</code><idPere>1</idPere></organisme></liste>` }))
        
        let result: Organisme[] = await mockFFTTAPI.getOrganismes('F');
        
        expect(result).toEqual(organismes)
    })
})
