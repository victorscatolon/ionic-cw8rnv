import { BackgroundMode } from '@ionic-native/background-mode';
import { Component, AfterViewInit } from '@angular/core';
import { LoadingController, ModalController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { MusicControls } from '@ionic-native/music-controls';
import { Storage } from '@ionic/storage';

import { CityListPage } from '../city-list/city-list';
import { HttpUtilService } from '../../services/http-util-service';
import { Radio } from '../../models/radios';
import { RadiosProvider } from '../../providers/radios/radios';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {
  audio: MediaObject;
  heroImageSrc: string;
  isPlaying: boolean;
  radios: Radio[];
  favoriteRadios = {};
  selectedRadio: Radio;

  constructor(
    private backgroundMode: BackgroundMode,
    private loadingCtrl: LoadingController,
    private media: Media,
    private modalCtrl: ModalController,
    private musicControls: MusicControls,
    private radiosProvider: RadiosProvider,
    private storage: Storage,
    public logger: EventLoggerProvider
  ) {
    this.backgroundMode.enable();
    this.getRadios();
  }

  ngAfterViewInit() {
    this.getHeroImage();
  }

  getRadios() {
    const loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });

    loading.present();

    this.radiosProvider.load().then(data => {
      loading.dismiss();

      const radios = data['data'];

      this.storage.get('favoriteRadios').then(favoriteRadios => {
        if (!favoriteRadios) {
          this.radios = radios;
        } else {
          this.favoriteRadios = JSON.parse(favoriteRadios);
          this.radios = radios.sort(this.sortRadios.bind(this));
        }
      });
    });
  }

  sortRadios(curr, next) {
    const currViews = this.favoriteRadios[curr._id] || 0;
    const nextViews = this.favoriteRadios[next._id] || 0;

    if (currViews < nextViews) {
      return 1;
    } else if (currViews > nextViews) {
      return -1;
    }

    return 0;
  }

  getHeroImage() {
    this.radiosProvider
      .loadTopo()
      .subscribe(hero => (this.heroImageSrc = hero.url));
  }

  onRadioSelect(radio) {
    this.selectedRadio = radio;

    if (radio.RadioRef) {
      this.openCityListModal(radio);
      return;
    }

    this.playRadio();
  }

  openCityListModal(radio) {
    const cityListModal = this.modalCtrl.create(CityListPage, {
      radioRef: radio.RadioRef,
      logoSrc: radio.Imagem_app2
    });

    cityListModal.present();
    cityListModal.onDidDismiss((radio: Radio) => {
      if (radio) {
        this.selectedRadio = Object.assign({}, this.selectedRadio, radio);

        this.playRadio();
      }
    });
  }

  playRadio() {
    const views = this.favoriteRadios[this.selectedRadio._id] || 0;
    const streamUrl = this.selectedRadio.stream_address;

    this.favoriteRadios[this.selectedRadio._id] = views + 1;
    this.storage.set('favoriteRadios', JSON.stringify(this.favoriteRadios));

    if (this.audio) {
      this.audio.stop();
    }
    this.FbaPlayRadio();
    this.FbaViewAdvertising();

    this.isPlaying = true;
    this.audio = this.media.create(streamUrl);
    this.audio.play();
    this.createRadioControls();
    this.subscribeToRadioControls();
    this.musicControls.listen();
  }

  createRadioControls() {
    this.musicControls.create({
      track: this.selectedRadio.title,
      artist: this.getArtist(),
      cover: this.selectedRadio.Imagem_app4,
      isPlaying: this.isPlaying,
      dismissable: false,
      hasPrev: false,
      hasNext: false
    });
  }

  subscribeToRadioControls() {
    this.musicControls.subscribe().subscribe(action => {
      const message = JSON.parse(action).message;

      switch (message) {
        case 'music-controls-play':
        case 'music-controls-pause':
          this.playPause();
          break;
      }
    });
  }

  playPause() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.audio.pause();
      this.musicControls.updateIsPlaying(false);
      return;
    }

    this.isPlaying = true;
    this.audio.play();
    this.musicControls.updateIsPlaying(true);
  }

  getArtist(): string {
    const frequency = this.selectedRadio.frequency || '';
    const city = this.selectedRadio.cidade || '';

    if (frequency && city) {
      return `${frequency} - ${city}`;
    } else if (frequency) {
      return frequency;
    } else {
      return city;
    }
  }

  openLink(event, link) {
    window.open(link, '_system', 'location=yes');
    this.FbaClickAdvertising();
    event.preventDefault();
  }

  FbaViewAdvertising() {
    const ativo = this.selectedRadio.advertisingActive;
    if (ativo === true) {
      const titulo = this.selectedRadio.title;
      const cidade = this.selectedRadio.cidade;
      const evento = 'AD_View_';

      const noSpaceT = titulo.replace(/ /g, '_');
      const noAccentsT = noSpaceT
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const noSpaceC = cidade.replace(/ /g, '_');

      const noAccentsC = noSpaceC
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      this.logger.logButton(`${evento}${noAccentsT}_${noAccentsC}`, {
        pram: 'paramValue'
      });

      console.log(`${evento}${noAccentsT}_${noAccentsC}`);
    }
  }
  FbaPlayRadio() {
    const titulo = this.selectedRadio.title;
    const cidade = this.selectedRadio.cidade;
    const evento = 'Play_';

    const noSpaceT = titulo.replace(/ /g, '_');

    const noAccentsT = noSpaceT
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const noSpaceC = cidade.replace(/ /g, '_');

    const noAccentsC = noSpaceC
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    this.logger.logButton(`${evento}${noAccentsT}_${noAccentsC}`, {
      pram: 'paramValue'
    });
    console.log(`${evento}${noAccentsT}_${noAccentsC}`);
  }

  FbaClickAdvertising() {
    const titulo = this.selectedRadio.title;
    const cidade = this.selectedRadio.cidade;
    const evento = 'AD_Click_';

    const noSpaceT = titulo.replace(/ /g, '_');

    const noAccentsT = noSpaceT
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const noSpaceC = cidade.replace(/ /g, '_');

    const noAccentsC = noSpaceC
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    this.logger.logButton(`${evento}${noAccentsT}_${noAccentsC}`, {
      pram: 'paramValue'
    });
    console.log(`${evento}${noAccentsT}_${noAccentsC}`);
  }
}
