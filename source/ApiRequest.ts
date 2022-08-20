const FFTTURL = 'http://www.fftt.com/mobile/pxml/';
import crypto from 'crypto';
import axios, { AxiosResponse } from 'axios';
import { decode } from 'html-entities';
import { ResponseData } from './model/ResponseData.interface';
import xml2js from 'xml2js';
import { InvalidURIParametersException } from './Exception/InvalidURIParametersException';
import { NoFFTTResponseException } from './Exception/NoFFTTResponseException';
import { URIPartNotValidException } from './Exception/URIPartNotValidException';
import { UnauthorizedCredentials } from './Exception/UnauthorizedCredentials';

export class ApiRequest {
    private password: string;
    private id: string;

    private xml2jsOptions: any = { mergeAttrs: true, trim : true, explicitRoot : false, explicitArray : false };

    constructor(password: string, id: string) {
        this.password = password;
        this.id = id;
    }

    private prepare(request: string, params: any = {}, queryParameter: string | null = null): string {
        const time = Date.now();
        const timeCrypted = crypto.createHmac("sha1", this.password).update(time.toString()).digest('hex');
        let uri =  `${FFTTURL}${request}.php?serie=${this.id}&tm=${time}&tmc=${timeCrypted}&id=${this.id}`;
        
        if (queryParameter) uri += `&${queryParameter}`;
        Object.keys(params).forEach((key: any) => uri += `&${key}=${params[key]}`)
        
        return uri;
    }

    public send = async (uri: string): Promise<ResponseData> => {
        let response: AxiosResponse = await axios.get(uri);
        let content = response.data;
        content = content.replace(/&(?!#?[a-z0-9]+;)/, '&amp;');
        // content = decodeURIComponent(escape(content));
        content = decode(content);
        content = await xml2js.parseStringPromise(content, this.xml2jsOptions);
        return content;
    }

    public get(request: string, params: object = {}, queryParameter: string | null = null): Promise<ResponseData>
    {
        let chaine = this.prepare(request, params, queryParameter);

        return this.send(chaine)
            .then((result: ResponseData) => {
                // console.log(result);
    
                // TODO
                // if(!Array.isArray(result)){
                //     throw new InvalidURIParametersException(request, params);
                // }
                // console.log(2);
        
                // if(result.hasOwnProperty('0')){
                //     throw new NoFFTTResponseException(chaine);
                // }
                
                return result;
            })
            .catch(e => {
                // console.error(e.message);
                
                if (e.status === 401){
                    xml2js.parseString(e.data, this.xml2jsOptions, (_err, result) => {
                        throw new UnauthorizedCredentials(request, result.erreur);
                    });
                }
                throw new URIPartNotValidException(request);
            })
    }
}