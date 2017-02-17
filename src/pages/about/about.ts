import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { WelcomePage } from '../';
import { Auth } from '../../providers';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  username:string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: Auth, public events:Events) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  ionViewWillEnter() {
    if(this.auth.user != null && this.auth.user.username != null)
      this.username = this.auth.user.username
    else
      this.username = "Guest";
  }


  loginSignup(){
    this.navCtrl.push(WelcomePage);
  }

  logout(){
    this.auth.logout();
    this.username = "Guest";
  }

  checkCodePush(){
    this.events.publish('CODEPUSH_CHECK');
  }


}
