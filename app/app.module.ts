import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { SQLite } from '@ionic-native/sqlite';
import { MusicControls } from '@ionic-native/music-controls';
import { Media } from '@ionic-native/media';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ColunistsPage } from '../pages/colunists/colunists';
import { CityListPage } from '../pages/city-list/city-list';

import { HttpUtilService } from '../services/http-util-service';
import { DatabaseProvider } from '../providers/database/database';
import { RadiosProvider } from '../providers/radios/radios';
import { RadiosdbProvider } from '../providers/radiosdb/radiosdb';
import { AdvertisingProvider } from '../providers/advertising/advertising';
import { EventLoggerProvider } from '../providers/event-logger/event-logger';
import { BackgroundMode } from '@ionic-native/background-mode';

@NgModule({
  declarations: [MyApp, HomePage, ListPage, CityListPage, ColunistsPage],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, ListPage, CityListPage, ColunistsPage],
  providers: [
    StatusBar,
    SplashScreen,
    HttpUtilService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    RadiosProvider,
    SQLite,
    DatabaseProvider,
    RadiosdbProvider,
    MusicControls,
    Media,
    BackgroundMode,
    AdvertisingProvider,
    EventLoggerProvider,
    FirebaseAnalytics
  ]
})
export class AppModule {}
