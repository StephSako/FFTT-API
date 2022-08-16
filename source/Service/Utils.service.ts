import { Equipe } from "../model/Equipe";

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

    public static formatPoints(classement: string) : number
    {
        let explode = classement.split("-");
        if (explode.length == 2){
            classement = explode[1];
        }
        return Number(classement);
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

     /**
     * @param array 
     * @returns 
     */
      public static wrappedArrayIfUnique(array: any[]):  any[]
      {
          if (array.length == count(array, COUNT_RECURSIVE)) {
              return [array];
          }
          return array;
      }
  
      public static isset(val?: any) {
          return (val !== undefined && val !== null)
      }

      /**
       * Convertisseur de date en string au format 'd/m/Y'
       */
      public static createDateFromFormat(date: string): Date
      {
        let explodedDate: string[] = date.split('/');
        return new Date(`${explodedDate[2]}/${explodedDate[1]}/${explodedDate[0]}`);
      }
}
