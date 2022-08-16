import { Equipe } from "../model/Equipe";
import removeAccents from 'remove-accents';

export class Utils
{
    public static returnNomPrenom(s: string) {
        let nom: string[] = [];
        let prenom: string[] = [];
        let words: string[] = s.split(" ");

        words.forEach((word: string) =>{
            let lastChar: string = word.split('').pop() ?? '';
            lastChar.toLowerCase() == lastChar ? prenom.push(word) : nom.push(word);
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
        return nomEquipe.replace(/ [0-9]+/, '');
    }

    public static removeAccentLowerCaseRegex(word: string): string
    {
        return removeAccents(word).toLowerCase().replace('?', '.');
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

      /**
       * 
       * @param value Arrondir un nombre flottant au dixième supérieur
       * @returns 
       */
      public static round(value: any) {
        var multiplier = Math.pow(10, 1);
        return Math.round(value * multiplier) / multiplier;
    }
}
