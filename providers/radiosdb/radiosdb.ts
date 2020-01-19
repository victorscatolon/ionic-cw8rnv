import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { Radio } from '../../models/radios';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the RadiosdbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RadiosdbProvider {

  private database: SQLiteObject;

  constructor(private dbProvider: DatabaseProvider) {
    this.database = dbProvider.database;
  }

  public insert(radio: Radio) {
    return this.dbProvider.isReady()
      .then((db: SQLiteObject) => {
        let sql = 'insert into radios (title, Imagem_app1, Imagem_app2, parent, RadioRef, stream_address, ordem) values (?, ?, ?, ?, ?, ?, ?)';
        let data = [radio.title, radio.Imagem_app1, radio.Imagem_app2, radio.parent ? 1 : 0, radio.RadioRef, radio.stream_address, 0];
        console.log(data, 'inserida com sucess');
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }



  public getAny() {
    return this.dbProvider.isReady()
      .then((db) => {

        return this.database.executeSql("SELECT count(*) from radios", [])
          .then((data) => {
            if (data.rows.length) {
              return data.rows.item(0);
            }
            return null;
          })

      })
  }


  public getAll() {
    return this.dbProvider.isReady()
      .then(() => {

        return this.database.executeSql("SELECT * from radios", [])
          .then((data) => {
            if (data.rows.length) {
              return data.rows.item(0);
            }
            return null;
          })

      })
  }





}
