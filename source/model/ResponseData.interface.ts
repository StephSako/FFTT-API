import { Actualite } from "./Actualite";
import { DivisionRaw } from "./Raw/DivisionRaw.interface";
import { ClassementResultEquipeRaw } from "./Raw/ClassementResultEquipeRaw.interface";
import { EquipeRaw } from "./Raw/EquipeRaw.interface";
import { HistoriqueRaw } from "./Raw/HistoriqueRaw.interface";
import { OrganismeRaw } from "./Raw/OrganismeRaw.interface";
import { PartieRaw } from "./Raw/PartieRaw.interface";
import { PouleResultEquipeRaw } from "./Raw/PouleResultEquipeRaw.interface";

export interface ResponseData {
    organisme: OrganismeRaw[],
    club: any, // Club[] | ClubDetailsRaw
    joueur: any, // JoueurRaw[] | ClassementRaw
    histo: HistoriqueRaw[],
    partie: PartieRaw[],
    equipe: EquipeRaw[],
    classement: ClassementResultEquipeRaw[],
    tour: any, //RencontreRaw[] | TourResultEquipeRaw[],
    news: Actualite[],
    division: DivisionRaw[],
    resultat: any // TODO Creer une interface
    poule: PouleResultEquipeRaw
}