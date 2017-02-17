import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController  } from 'ionic-angular';
import { Call, Visit, Placement } from '../../models';
import { DataProvider } from '../../providers';
import * as moment from 'moment';
import * as _ from "lodash";
import { saveIntoArray } from '../../utils';
import { VisitBooksPage, VisitMagsPage, VisitTractsPage, VisitVideosPage } from '../'

@Component({
  selector: 'page-call-visit',
  templateUrl: 'call-visit.html'
})
export class CallVisitPage {

  call:Call = new Call();
  visit:Visit = new Visit();
  minDate:any;
  maxDate:any;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController ,
              public dataProvider: DataProvider,
              public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CallVisitPage');
  }

  ionViewWillEnter() {
    this.call = Object.assign({}, this.navParams.get("call")); 
    if(this.call.visits == null)
      this.call.visits = new Array<Visit>();
    this.visit = Object.assign({}, this.navParams.get('visit'));
    if(this.visit.placements == null)
      this.visit.placements = new Array<Placement>();
    this.minDate = moment.utc().startOf('day').format('YYYY-MM-DD');
    this.maxDate = moment.utc().add(2, 'y').format('YYYY-MM-DD');

  }

  ionViewWillLeave(){
    this.save(); 
  }

  save(){
    console.log("ARE WE SAVING VISIT: ");
    //lets see if changes where made
    if(_.isEqual(this.visit, this.navParams.get("visit")))
      return; //no changes have been make, no need to save
    
    console.log("VISIT YES WE ARE");
    this.call.visits = saveIntoArray(this.visit, this.call.visits, "id");
    console.log("** New Visit Array: ", this.call.visits);
    this.dataProvider.save(this.call);
    //this.dataProvider.tempStore['call'] = this.call;
 }


  remove(index:number){
    this.visit.placements.splice( index, 1 );
  }

  addVideo(){
    let modal = this.modalCtrl.create(VisitVideosPage, {
      enableBackdropDismiss: true,
      showBackdrop: true
    });
    modal.onDidDismiss(data => {
      console.log(data);

      if(data){
        this.visit.placements.push(data);
      }
    });

    modal.present();
  }

  addBook(){
    let modal = this.modalCtrl.create(VisitBooksPage, {
      enableBackdropDismiss: true,
      showBackdrop: true
    });
    modal.onDidDismiss(data => {
      console.log(data);

      if(data){
        this.visit.placements.push(data);
      }
    });

    modal.present();
  }

  addMag(){

  }

  addTract(){

  }

}
