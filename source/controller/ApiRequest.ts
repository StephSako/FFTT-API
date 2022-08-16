const FFTTURL = 'http://www.fftt.com/mobile/pxml/';
import crypto from 'crypto';
import axios, { AxiosResponse } from 'axios';
import { decode } from 'html-entities';
import { ResponseData } from '../model/ResponseData.interface';
import xml2js from 'xml2js';
import { InvalidURIParametersException } from '../Exception/InvalidURIParametersException';
import { NoFFTTResponseException } from '../Exception/NoFFTTResponseException';
import { URIPartNotValidException } from '../Exception/URIPartNotValidException';
import { UnauthorizedCredentials } from '../Exception/UnauthorizedCredentials';

export class ApiRequest {
    private password: string;
    private id: string;

    constructor(password: string, id: string) {
        this.password = password;
        this.id = id;
    }

    private prepare(request: string, params: any = [], queryParameter: string | null = null): string {
        const time = Date.now();
        const timeCrypted = crypto.createHmac("sha1", this.password).update(time).digest('hex');
        let uri =  `${FFTTURL}${request}.php?serie${this.id}&tm=${time}&tmc=${timeCrypted}&id=${this.id}`;
        if (queryParameter){
            uri += `&${queryParameter}`;
        }

        params.forEach((key: any) => uri += `&${key}=${params[key]}`)
        return uri;
    }

    public send = async (uri: string) => {
        let response: AxiosResponse = await axios.get(uri);
        let content = response.data;
        content = content.replace(/&(?!#?[a-z0-9]+;)/, '&amp;');
        // content = decodeURIComponent(escape(content));
        content = decode(content);

        content = xml2js.parseString(content, { mergeAttrs: true, trim : true, explicitRoot : false, explicitArray : false }, (_err: any, result: any) => {
            return result;
        });
        return content;
    }

    public get(request: string, params: object = {}, queryParameter: string | null = null): ResponseData
    {
        let chaine = this.prepare(request, params, queryParameter);
        let result: any;
        try{
            result = this.send(chaine);
        }
        catch (ce/*: ClientException*/) {
            if(ce->getResponse()->getStatusCode() === 401){
                throw new UnauthorizedCredentials(request, ce->getResponse()->getBody()->getContents());
            }
            throw new URIPartNotValidException(request);
        }

        if(!Array.isArray(result)){
            throw new InvalidURIParametersException(request, params);
        }
        if(result.hasOwnProperty('0')){
            throw new NoFFTTResponseException(chaine);
        }
        return result;
    }
}