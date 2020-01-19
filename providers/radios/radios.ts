import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpUtilService } from '../../services/http-util-service';
import { Observable } from 'rxjs/Observable';


/*
  Generated class for the RadiosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RadiosProvider {
  data: any;
  dataRef: any;

  constructor(public http: HttpClient, private httpUtilService: HttpUtilService) {
    console.log('Hello RadiosProvider Provider');
  }

  load() {
    return new Promise(resolve => {
      let url = `radios/app/true`;
      this.http.get(this.httpUtilService.url(url))
        .map(res => res)
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }


  loadTopo(): Observable<any> {
    return this.http.get(this.httpUtilService.url('topo'))
      .map(response => response['data']);
  }

  loadRadioRef(radioRef) {
    return new Promise(resolve => {
      let url = `radios/${radioRef}`;

      this.http.get(this.httpUtilService.url(url))
        .map(res => res)
        .subscribe(data => {
          this.dataRef = data;
          console.log(this.dataRef);
          resolve(this.dataRef);
        });
    });
  }

}
