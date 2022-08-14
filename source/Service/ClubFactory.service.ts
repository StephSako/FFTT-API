import { Club } from "../model/Club.interface";

export class ClubFactory
{
    /**
     * @param array data
     * @return Club[]
     */
    public createFromArray(data: []): Club[]
    {
        let result: Club[] = [];
        data.forEach((clubData: any) => {
            let club: Club = {
                clubData['numero'],
                clubData['nom'],
                Array.isArray(clubData['validation']) ? null : \DateTime::createFromFormat('d/m/Y', clubData['validation'])
            }
            result.push(club);
        })
        return result;
    }
}
