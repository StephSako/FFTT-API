import { Equipe } from "../Model/Equipe";
import removeAccents from 'remove-accents';
import moment from "moment";

export class Utils
{
    public static returnNomPrenom(s: string) {
        let nom: string[] = [];
        let prenom: string[] = [];
        let words: string[] = s.split(" ");

        words.forEach((word: string) =>{
            let lastChar: string = word.slice(-1);
            lastChar.toLowerCase() == lastChar ? prenom.push(word) : nom.push(word);
        })

        return [
            nom.join(" "),
            prenom.join(" "),
        ];
    }

    public static formatPoints(classement: string): number
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

    public static removeAccentLowerCaseRegex(word: string): string
    {
        return removeAccents(word).toLowerCase().replace(/\?/g, '.');
    }

    /**
     * @param array 
     */
    public static wrappedArrayIfUnique(array: any): any[]
    {
        if (!array) return []
        return !Array.isArray(array) ? [array] : array;
    }

    public static isset(val?: any): boolean {
        return (val !== undefined && val !== null)
    }

    /**
     * Convertisseur d'une date en string au format 'd/m/Y'
     */
    public static createDate(date: string): Date
    {
        let explodedDate: string[] = date.split('/');
        return new Date(`${explodedDate[2]}/${explodedDate[1]}/${explodedDate[0]}`);
    }
      
    /**
     * Convertisseur de date en Date au format 'd/m/Y'
     */
    public static createStringDateToFormat(date: Date): string
    {
        return moment(date).format('DD/MM/YYYY');
    }

    /**
     * 
     * @param value Arrondir un nombre flottant au dixième supérieur
     * @returns 
     */
    public static round(value: any): number {
        var multiplier = Math.pow(10, 1);
        return Math.round(value * multiplier) / multiplier;
    }

    /**
     * Retourne le mois précédent
     */
    public static getPreviousMonthsMonth(): number {
        return moment(new Date()).subtract(1, 'months').month() + 1
    }
    
    /**
     * Retourne l'année du mois précédent
     */
    public static getPreviousMonthsYear(): number {
        return moment(new Date()).subtract(1, 'months').year()
    }

    public static returnStringOrNull(value: string): string | null {
        return value === '' ? null : value;
    }
    
    public static returnNumberOrNull(value: string): number | null {
        return value === '' ? null : Number(value);
    }
}
