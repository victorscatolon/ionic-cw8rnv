import { Injectable } from '@angular/core';

@Injectable()
export class HttpUtilService {

    constructor() { }

    private API_URL: string = 'http://api2radios.band.uol.com.br/';
    public trackid: string = 'UA-135011010-1';

    url(path: string) {
        return this.API_URL + path;
    }

}
