import axios from "axios";
import { ClubNotFoundException } from "../Exception/ClubNotFoundException";
import { FFTTAPI } from "../FFTTAPI"
import { Actualite } from "../Model/Actualite";
import { Club } from "../Model/Club";
import { ClubDetails } from "../Model/ClubDetails";
import { Division } from "../Model/Division";
import { Joueur } from "../Model/Joueur";
import { Organisme } from "../Model/Organisme";

describe('FFTTAPI class', () => {

    const id: string = process.env.ID_SECRET ?? '';
    const password: string = process.env.PASSWORD_SECRET ?? '';
    const mockFFTTAPI: FFTTAPI = new FFTTAPI(id, password);
    const listeVide: string = `<?xml version="1.0" encoding="ISO-8859-1"?><liste/>`;

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('getActualites should return none actualité', async () => {
        let actualites: Actualite[] = []

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: listeVide }))
        
        let result: Actualite[] = await mockFFTTAPI.getActualites();
        
        expect(result).toEqual(actualites)
    })
    
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

    test('getOrganismes should return none organisme', async () => {
        let organismes: Organisme[] = [];

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: listeVide }))
        
        let result: Organisme[] = await mockFFTTAPI.getOrganismes();
        
        expect(result).toEqual(organismes)
    })
    
    test('getOrganismes should return only one organisme', async () => {
        let organismes: Organisme[] = [new Organisme( 'FFTT', '1', 'FEDE', '' )];

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><organisme><libelle>FFTT</libelle><id>1</id><code>FEDE</code><idPere/></organisme></liste>` }))
        
        let result: Organisme[] = await mockFFTTAPI.getOrganismes();
        
        expect(result).toEqual(organismes)
    })
    
    test('getOrganismes should return two organismes', async () => {
        let organismes: Organisme[] = [
            new Organisme( 'ZONE 1 (CVL-IDF)', '8', 'Z01', '1' ),
            new Organisme( 'ZONE 2 (BR-PDL)', '7', 'Z02', '1' )
        ]

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><organisme><libelle>ZONE 1 (CVL-IDF)</libelle><id>8</id><code>Z01</code><idPere>1</idPere></organisme><organisme><libelle>ZONE 2 (BR-PDL)</libelle><id>7</id><code>Z02</code><idPere>1</idPere></organisme></liste>` }))
        
        let result: Organisme[] = await mockFFTTAPI.getOrganismes('N');
        
        expect(result).toEqual(organismes)
    })

    test('getClubsByDepartement should return none club', async () => {
        let club: Club[] = []

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: listeVide }))
        
        let result: Club[] = await mockFFTTAPI.getClubsByDepartement(93);
        
        expect(result).toEqual(club)
    })

    test('getClubsByDepartement should return only one club', async () => {
        let club: Club[] = [new Club('12930024', 'L', '08930024', 'SAINT-DENIS US93TT', null)]

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><club><idclub>12930024</idclub><numero>08930024</numero><nom>SAINT-DENIS US93TT</nom><validation/><typeclub>L</typeclub></club></liste>` }))
        
        let result: Club[] = await mockFFTTAPI.getClubsByDepartement(93);
        
        expect(result).toEqual(club)
    })
    
    test('getClubsByDepartement should return two clubs', async () => {
        let clubs: Club[] = [
            new Club('40001134', 'L', '08951458', 'ADAMOIS TENNIS DE TABLE', new Date('2022/07/08')),
            new Club('12950623', 'L', '08950623', 'ARGENTEUIL TT', new Date('2022/08/22'))
        ]

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><club><idclub>40001134</idclub><numero>08951458</numero><nom>ADAMOIS TENNIS DE TABLE</nom><validation>08/07/2022</validation><typeclub>L</typeclub></club><club><idclub>12950623</idclub><numero>08950623</numero><nom>ARGENTEUIL TT</nom><validation>22/08/2022</validation><typeclub>L</typeclub></club></liste>` }))
        
        let result: Club[] = await mockFFTTAPI.getClubsByDepartement(95);
        
        expect(result).toEqual(clubs)
    })

    test('getClubsByName should return none club', async () => {
        let club: Club[] = []

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: listeVide }))
        
        let result: Club[] = await mockFFTTAPI.getClubsByName('frette');
        
        expect(result).toEqual(club)
    })

    test('getClubsByName should return only one club', async () => {
        let club: Club[] = [ new Club('12951331', 'L', '08951331', 'LA FRETTE ESFTT', new Date('2022/07/13')) ]

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><club><idclub>12951331</idclub><numero>08951331</numero><nom>LA FRETTE ESFTT</nom><validation>13/07/2022</validation><typeclub>L</typeclub></club></liste>` }))
        
        let result: Club[] = await mockFFTTAPI.getClubsByName('frette');
        
        expect(result).toEqual(club)
    })
    
    test('getClubsByName should return two clubs', async () => {
        let clubs: Club[] = [
            new Club('17610002', 'L', '09610002', 'ARGENTAN BAYARD', new Date('2022/07/06')),
            new Club('17610073', 'L', '09610073', 'ARGENTAN OL', new Date('2022/07/08'))
        ]

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><club><idclub>17610002</idclub><numero>09610002</numero><nom>ARGENTAN BAYARD</nom><validation>06/07/2022</validation><typeclub>L</typeclub></club><club><idclub>17610073</idclub><numero>09610073</numero><nom>ARGENTAN OL</nom><validation>08/07/2022</validation><typeclub>L</typeclub></club></liste>` }))
        
        let result: Club[] = await mockFFTTAPI.getClubsByName('argent');
        
        expect(result).toEqual(clubs)
    })

    test('getDivisionsByEpreuve should return none division', async () => {
        let division: Division[] = []

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: listeVide }))
        
        let result: Division[] = await mockFFTTAPI.getDivisionsByEpreuve('E', 8985, 1);
        
        expect(result).toEqual(division)
    })
    
    test('getDivisionsByEpreuve should return only one division', async () => {
        let division: Division[] = [ new Division(106853, 'FED_PRO A Messieurs (Phase 1)') ]

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><division><iddivision>106853</iddivision><libelle>FED_PRO A Messieurs (Phase 1)</libelle></division></liste>` }))
        
        let result: Division[] = await mockFFTTAPI.getDivisionsByEpreuve('E', 8985, 1);
        
        expect(result).toEqual(division)
    })
    
    test('getDivisionsByEpreuve should return two divisions', async () => {
        let divisions: Division[] = [
            new Division(106853, 'FED_PRO A Messieurs (Phase 1)'),
            new Division(107118, 'FED_PRO B Messieurs (Phase 1)')
        ]

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><division><iddivision>106853</iddivision><libelle>FED_PRO A Messieurs (Phase 1)</libelle></division><division><iddivision>107118</iddivision><libelle>FED_PRO B Messieurs (Phase 1)</libelle></division></liste>` }))
        
        let result: Division[] = await mockFFTTAPI.getDivisionsByEpreuve('E', 8985, 1);
        
        expect(result).toEqual(divisions)
    })
    
    test('getJoueursByClub should return none joueurs', async () => {
        let joueurs: Joueur[] = []

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: listeVide }));
        
        let result: Joueur[] = await mockFFTTAPI.getJoueursByClub('08951331');
        
        expect(result).toEqual(joueurs)
    })
    
    test('getJoueursByClub should return only one joueur', async () => {
        let joueurs: Joueur[] = [ new Joueur('9529825', '08951331', 'LA FRETTE ESFTT', 'SAKOVITCH', 'Stephen', 1112, true, null, null, null) ]
        joueurs = joueurs.map(joueur => {
            delete joueur.classementOfficiel;
            return joueur;
        })

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><joueur><licence>9529825</licence><nom>SAKOVITCH</nom><prenom>Stephen</prenom><club>08951331</club><nclub>LA FRETTE ESFTT</nclub><sexe>M</sexe><echelon></echelon><place/><points>1112</points></joueur></liste>` }));
        
        let result: Joueur[] = await mockFFTTAPI.getJoueursByClub('0000000');
        
        expect(result).toEqual(joueurs)
    })
    
    test('getJoueursByClub should return two joueurs', async () => {
        let joueurs: Joueur[] = [
            new Joueur('9529825', '08951331', 'LA FRETTE ESFTT', 'SAKOVITCH', 'Stephen', 1112, true, null, null, null),
            new Joueur('1324075', '13130158', 'TT CHATEAUNEUF LA MEDE', 'SAKOUHI', 'Rida', 500, true, null, null, null)
        ]
        joueurs = joueurs.map(joueur => {
            delete joueur.classementOfficiel;
            return joueur;
        })

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><joueur><licence>9529825</licence><nom>SAKOVITCH</nom><prenom>Stephen</prenom><club>08951331</club><nclub>LA FRETTE ESFTT</nclub><sexe>M</sexe><echelon></echelon><place/><points>1112</points></joueur><joueur><licence>1324075</licence><nom>SAKOUHI</nom><prenom>Rida</prenom><club>13130158</club><nclub>TT CHATEAUNEUF LA MEDE</nclub><sexe>M</sexe><echelon></echelon><place/><points>500</points></joueur></liste>` }));
        
        let result: Joueur[] = await mockFFTTAPI.getJoueursByClub('08951331'); // TODO Par noms aussi
        
        expect(result).toEqual(joueurs)
    })
    
    test("getClubDetails should return none club's details and throw Error", () => {
        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: listeVide }));
        
        let result = mockFFTTAPI.getClubDetails('00000000');

        result.then((r) => {
            expect(r).toThrow(ClubNotFoundException);
        })
    })
    
    test("getClubDetails should return club's details", async () => {
        let clubDetails: ClubDetails = new ClubDetails(
        12951331, '08951331', 'LA FRETTE ESFTT', 'Salle Municipale Albert Marquet', 'avenue des Lilas', null, null,
        '95530', 'LA FRETTE SUR SEINE', 'http://www.esftt.com/', 'NERI', 'Raphael', 'neri_raphael@yahoo.fr', '0629770337', null, null);

        jest.spyOn(axios, 'get').mockResolvedValue(Promise.resolve({ data: `<?xml version="1.0" encoding="ISO-8859-1"?><liste><club><idclub>12951331</idclub><numero>08951331</numero><nom>LA FRETTE ESFTT</nom><nomsalle>Salle Municipale Albert Marquet</nomsalle><adressesalle1>avenue des Lilas</adressesalle1><adressesalle2/><adressesalle3></adressesalle3><codepsalle>95530</codepsalle><villesalle>LA FRETTE SUR SEINE</villesalle><web>http://www.esftt.com/</web><nomcor>NERI</nomcor><prenomcor>Raphael</prenomcor><mailcor>neri_raphael@yahoo.fr</mailcor><telcor>0629770337</telcor><latitude/><longitude/><validation>13/07/2022</validation></club></liste>` }));
        
        let result: ClubDetails = await mockFFTTAPI.getClubDetails('08951331');
        
        expect(result).toEqual(clubDetails)
    })
})
