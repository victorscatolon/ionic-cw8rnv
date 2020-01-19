import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Platform } from 'ionic-angular';
import { Radio } from '../../models/radios';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  constructor(private platform: Platform, private sqlite: SQLite) {

    this.platform.ready().then(() => {

      this.sqlite.create({
        name: 'radio.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.createTables().then(() => {
            this.dbReady.next(true);
          });
        })

    });

  }

  public database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  private createTables() {

    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS radiosCache (id integer primary key AUTOINCREMENT NOT NULL, LastUpdate TIMESTAMP);`)
      .then(() => {
        return this.database.executeSql(
          `CREATE TABLE IF NOT EXISTS radios (id integer primary key AUTOINCREMENT NOT NULL,
                _id TEXT,
                title TEXT,
                Imagem_app1 TEXT,
                Imagem_app2 TEXT,
                Imagem_app3 TEXT,
                parent integer,
                RadioRef TEXT,
                cidade TEXT,
                ordem integer,
                stream_address_app TEXT,
                stream_address TEXT);`)
      }).catch((err) => console.log("error detected creating tables", err));

  }

  public isReady() {
    return new Promise((resolve, reject) => {
      if (this.dbReady.getValue()) {
        resolve();
      }
      else {
        this.dbReady.subscribe((ready) => {
          if (ready) {
            resolve();
          }
        });
      }
    })
  }

  public insert(radio: Radio, orderRadio: number) {
    return this.isReady()
      .then((db: SQLiteObject) => {
        let sql = 'insert into radios (title, Imagem_app1, Imagem_app2,Imagem_app3, parent, RadioRef, stream_address, stream_address_app, cidade, ordem, _id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let data = [radio.title, radio.Imagem_app1, radio.Imagem_app2, radio.Imagem_app3, radio.parent ? 1 : 0, radio.RadioRef, radio.stream_address, radio.stream_address_app, radio.cidade, orderRadio, radio._id];

        return this.database.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public updateAll(radio: Radio) {

    return this.isReady()
      .then((db: SQLiteObject) => {


        let sqltitle = 'update radios set title = ? where _id = ?';
        let datatitle = [radio.title, radio._id];
        this.database.executeSql(sqltitle, datatitle);

        let sqlImagem_app1 = 'update radios set Imagem_app1 = ? where _id = ?';
        let dataImagem_app1 = [radio.Imagem_app1, radio._id];
        this.database.executeSql(sqlImagem_app1, dataImagem_app1);

        let sqlImagem_app2 = 'update radios set Imagem_app2 = ? where _id = ?';
        let dataImagem_app2 = [radio.Imagem_app2, radio._id];
        this.database.executeSql(sqlImagem_app2, dataImagem_app2);


        let sqlRadioRef = 'update radios set RadioRef = ? where _id = ?';
        let dataRadioRef = [radio.RadioRef, radio._id];
        this.database.executeSql(sqlRadioRef, dataRadioRef);


        let sqlstream_address_app = 'update radios set stream_address_app = ? where _id = ?';
        let datastream_address_app = [radio.stream_address_app, radio._id];
        this.database.executeSql(sqlstream_address_app, datastream_address_app);


        let sqlcidade = 'update radios set cidade = ? where _id = ?';
        let datacidade = [radio.cidade, radio._id];
        this.database.executeSql(sqlcidade, datacidade);

        // return this.database.executeSql(sql, data)
        //   .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getAny() {
    return this.isReady()
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

  public updateOrder(id) {
    console.log(id);
    return this.isReady()
      .then(() => {

        let sql = 'update  radios set ordem = ordem + 1 where _id = ?';
        let data = [id];

        return this.database.executeSql(sql, data)
          .catch((e) => console.error(e));

      })
  }

  public getAll() {
    return this.isReady()
      .then(() => {
        return this.database.executeSql("SELECT * from radios order by ordem desc", [])
          .then((data) => {
            let lists = [];
            for (let i = 0; i < data.rows.length; i++) {
              lists.push(data.rows.item(i));
            }
            return lists;
          })

      })
  }

  public dropTable() {
    return this.isReady()
      .then(() => {
        return this.database.executeSql("delete from radios", []);
      })
  }

}
