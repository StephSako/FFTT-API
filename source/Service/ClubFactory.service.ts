import { Club } from "../Model/Club";
import { ClubRaw } from "../Model/Raw/ClubRaw.interface";
import { Utils } from "./Utils.service";

export class ClubFactory
{
    /**
     * @param ClubRaw[] data
     * @return Club[]
     */
    public static createClubFromArray(data: ClubRaw[]): Club[] | Club
    {
        let result: Club[] = [];
        data.forEach((clubData: ClubRaw) => {
            result.push(new Club(
                clubData.idclub,
                clubData.typeclub,
                clubData.numero,
                clubData.nom,
                clubData.validation ? Utils.createDate(clubData.validation) : null
            ));
        })
        return result.length === 1 ? result[0] : result;
    }
}
