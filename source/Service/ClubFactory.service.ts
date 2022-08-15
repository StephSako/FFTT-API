import { Club } from "../model/Club.interface";

export class ClubFactory
{
    /**
     * @param Club[] data
     * @return Club[]
     */
    public createFromArray(data: Club[]): Club[]
    {
        let result: Club[] = [];
        data.forEach((clubData: Club) => {
            let club: Club = {
                clubData.numero,
                clubData.nom,
                Array.isArray(clubData.validation) ? null : DateTime.createFromFormat('d/m/Y', clubData.validation)
            }
            result.push(club);
        })
        return result;
    }
}
