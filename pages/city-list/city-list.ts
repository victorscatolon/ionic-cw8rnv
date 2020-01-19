import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Radio } from './../../models/radios';
import { RadiosProvider } from '../../providers/radios/radios';

/**
 * Generated class for the CityListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-city-list',
  templateUrl: 'city-list.html',
})
export class CityListPage {
  radioRef: string;
  logoSrc: string;
  radios: Radio[];

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private radiosProvider: RadiosProvider
  ) {
    this.radioRef = navParams.get('radioRef');
    this.logoSrc = navParams.get('logoSrc');

    this.getRadioChildren();
  }

  getRadioChildren() {
    this.radiosProvider.loadRadioRef(this.radioRef)
      .then(data => {
        this.radios = data['data'];
      });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  onRadioSelect(selectedRadio) {
    this.viewCtrl.dismiss(selectedRadio);
  }
}
