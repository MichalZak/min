import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Auth, DataProvider } from '../../providers';
//import { EmailComposer } from '@ionic-native/email-composer';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  languages:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public auth: Auth,
              //public emailComposer: EmailComposer,
              public dataProvider: DataProvider, 
              public events:Events) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  ionViewWillEnter() {
    this.languages = this.dataProvider.getDoc('pub/global/languages');
    console.log("Languages: ", this.languages);
  }


  backup(){
    console.log("Backup");
    //get all the data
    
    let data = this.dataProvider.getDocs();
    let s = JSON.stringify(data);

    let to = 'michalzak@gmail.com';
    let subject = 'this is email title';
    let body = 'this is email body:  ';

    let email = {
      to: to,
      subject: subject,
      body: body+ s
    }

//    EmailComposer..open(email);
  }



}
