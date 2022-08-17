import { Club } from "../model/Club";
import { ClubRaw } from "../model/Raw/Clubraw.interface";
import { Utils } from "./Utils.service";

export class ClubFactory
{
    /**
     * @param ClubRaw[] data
     * @return Club[]
     */
    public createClubFromArray(data: ClubRaw[]): Club[] | Club
    {
        let result: Club[] = [];
        data.forEach((clubData: ClubRaw) => {
            result.push(new Club(
                Number(clubData.idclub),
                clubData.typeclub,
                clubData.numero,
                clubData.nom,
                clubData.validation ? Utils.createDateFromFormat(clubData.validation) : null
            ));
        })
        return result.length === 1 ? result[0] : result;
    }
}
