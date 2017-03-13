import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { WelcomePage } from '../';
import { Auth, DataProvider } from '../../providers';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  languages:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public auth: Auth,
              public dataProvider: DataProvider, 
              public events:Events) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  ionViewWillEnter() {
    this.languages = this.dataProvider.getDoc('pub/global/languages');
    console.log("Languages: ", this.languages);
  }


  loginSignup(){
    this.navCtrl.push(WelcomePage);
  }



}
