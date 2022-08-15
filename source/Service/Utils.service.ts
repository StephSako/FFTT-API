import { Equipe } from "../model/Equipe.interface";

export class Utils
{
    public static returnNomPrenom(s: string) {
        let nom: string[] = [];
        let prenom: string[] = [];
        let words = s.split(" ");

        words.forEach((word: string) =>{
            let lastChar = substr(word, -1);
            mb_strtolower(lastChar, "UTF-8") == lastChar ? prenom.push(word) : nom.push(word);
        })

        return [
            nom.join(" "),
            prenom.join(" "),
        ];
    }

    public static formatPoints(classement: string) : string
    {
        let explode = classement.split("-");
        if (explode.length == 2){
            classement = explode[1];
        }
        return classement;
    }

    public static extractNomEquipe(equipe: Equipe): string
    {
        let explode = equipe.libelle.split(" - ");
        if(explode.length === 2){
            return explode[0];
        }
        return equipe.libelle;
    }

    public static extractClub(equipe: Equipe): string
    {
        let nomEquipe = this.extractNomEquipe(equipe);
        return preg_replace('/ [0-9]+/', '', nomEquipe);
    }

    public static removeAccentLowerCaseRegex(word: string): string
    {
        return str_replace('?', '.', mb_convert_case(\Transliterator::create('NFD; [:Nonspacing Mark:] Remove;')
            ->transliterate(word), MB_CASE_LOWER, "UTF-8"));
    }
}
