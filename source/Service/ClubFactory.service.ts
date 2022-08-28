import { Club } from "../Model/Club";
import { ClubRaw } from "../Model/Raw/ClubRaw.interface";
import { Utils } from "./Utils.service";

export class ClubFactory
{
    /**
     * @param ClubRaw[] data
     * @return Club[]
     */
    public static createClubFromArray(clubsRaw: ClubRaw[]): Club[]
    {
        let clubs: Club[] = [];
        
        clubsRaw.forEach((clubData: ClubRaw) => {
            clubs.push(new Club(
                clubData.idclub,
                clubData.typeclub,
                clubData.numero,
                clubData.nom,
                clubData.validation ? Utils.createDate(clubData.validation) : null
            ));
        })
        return clubs;
    }
}
