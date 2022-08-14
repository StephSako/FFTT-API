const FFTTURL = 'http://www.fftt.com/mobile/pxml/';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import {decode} from 'html-entities';

export class ApiRequest {
    private password: string;
    private id: string;

    constructor(password: string, id: string) {
        this.password = password;
        this.id = id;
    }

    private prepare(request: string, params: any = [], queryParameter: string|null = null): string {
        const time = Date.now();
        const timeCrypted = crypto.createHmac("sha1", 'password').update('1660418843226').digest('hex');
        let uri =  `${FFTTURL}${request}.php?serie${this.id}&tm=${time}&tmc=${timeCrypted}&id=${this.id}`;
        if (queryParameter){
            uri += `&${queryParameter}`;
        }

        params.forEach((key: any) => uri += `&${key}=${params[key]}`)
        return uri;
    }

    public send = async(uri: string) => {
        let response: AxiosResponse = await axios.get(uri);
        let content = response.data;
        content = content.replace(/&(?!#?[a-z0-9]+;)/, '&amp;');
        // content = decodeURIComponent(escape(content));
        content = decode(content);
        return content;
    }

    // public get(request: string, params: [] = [], queryParameter: string|null = null){
    //     let chaine = this.prepare(request, params, queryParameter);
    //     try{
    //         let result = this.send($chaine);
    //     }
    //     catch (ClientException $ce){
    //         if($ce->getResponse()->getStatusCode() === 401){
    //             throw new UnauthorizedCredentials($request, $ce->getResponse()->getBody()->getContents());
    //         }
    //         throw new URIPartNotValidException($request);
    //     }

    //     if(!is_array($result)){
    //         throw new InvalidURIParametersException($request, $params);
    //     }
    //     if(array_key_exists('0', $result)){
    //         throw new NoFFTTResponseException($chaine);
    //     }
    //     return $result;
    // }
}