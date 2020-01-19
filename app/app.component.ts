import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ColunistsPage } from '../pages/colunists/colunists';
import { CityListPage } from '../pages/city-list/city-list';

import { DatabaseProvider } from '../providers/database/database'
import { HttpUtilService } from '../services/http-util-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private dbProvider: DatabaseProvider,
    private http: HttpUtilService
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage },
      { title: 'Colunista', component: ColunistsPage },
      { title: 'Estações', component: CityListPage }

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.dbProvider.isReady();
      this.splashScreen.hide();


      // this.ga.startTrackerWithId(this.http.trackid)
      //   .then(() => {
      //     console.log('Google analytics is ready now');

      //     if (this.platform.is('ios')) {
      //       this.ga.trackView('Aparelho IOS');
      //       console.log('I am an iOS device!');
      //     } else {
      //       this.ga.trackView('Aparelho Android');
      //       console.log('I am an Android device!');
      //     }
      //     // Tracker is ready
      //     // You can now track pages or set additional information such as AppVersion or UserId
      //   })
      //   .catch(e => console.log('Error starting GoogleAnalytics', e));

    });


  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
