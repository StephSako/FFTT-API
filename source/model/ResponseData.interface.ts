import { Actualite } from "./Actualite";
import { DivisionRaw } from "./Raw/DivisionRaw.interface";
import { EquipePouleRaw } from "./Raw/EquipePouleRaw.interface";
import { EquipeRaw } from "./Raw/EquipeRaw.interface";
import { HistoriqueRaw } from "./Raw/HistoriqueRaw.interface";
import { OrganismeRaw } from "./Raw/OrganismeRaw.interface";
import { PartieRaw } from "./Raw/PartieRaw.interface";
import { RencontreRaw } from "./Raw/RencontreRaw.interface";

export interface ResponseData {
    organisme: OrganismeRaw[],
    club: any, // Club[] | ClubDetailsRaw
    joueur: any, // JoueurRaw[] | ClassementRaw
    histo: HistoriqueRaw[],
    partie: PartieRaw[],
    equipe: EquipeRaw[],
    classement: EquipePouleRaw[],
    tour: RencontreRaw[],
    news: Actualite[],
    division: DivisionRaw[],
    resultat: any // TODO Creer une interface
}