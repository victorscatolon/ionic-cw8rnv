import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { Advertising } from '../../models/advertising';
import { HttpUtilService } from '../../services/http-util-service';

/*
  Generated class for the AdvertisingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdvertisingProvider {

  constructor(public http: HttpClient, private httpUtilService: HttpUtilService) {
    console.log('Hello AdvertisingProvider Provider');
  }

  getAdvertising(): Observable<Advertising> {
    const API = this.httpUtilService.url('advertising');
    return this.http.get(API)
      .pipe(
        map(res => res['data'])
      );
  }

}
