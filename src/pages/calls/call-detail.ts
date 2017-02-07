import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import * as _ from "lodash"
import { Call, Visit } from '../../models';
import { DataProvider } from '../../providers';
import { Api } from '../../providers';
import { CallVisitPage } from './call-visit';
import * as moment from 'moment';


@Component({
  selector: 'page-call-detail',
  templateUrl: 'call-detail.html'
})
export class CallDetailPage {

  public call:Call = new Call();
  public oldCall:Call;
  minDate:any;
  maxDate:any;

  

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public dataProvider: DataProvider,
              public api: Api,
              public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
  }


  ionViewWillEnter() {
    this.oldCall =  Object.assign({}, this.dataProvider.getDoc(this.navParams.get("call")._id));
    //get call from provider, make sure its the lates one 
    this.call = Object.assign({}, this.dataProvider.getDoc(this.navParams.get("call")._id));
    this.minDate = moment.utc().startOf('day').subtract(1,'y').format('YYYY-MM-DD');
    this.maxDate = moment.utc().add(2, 'y').format('YYYY-MM-DD');

  }

  ionViewWillLeave(){
    this.save(); 
  }

  save(){
    //lets see if changes where made
    if(_.isEqual(this.call, this.oldCall))
      return; //no changes have been make, no need to save

    this.dataProvider.save(this.call);
 }

 addVisit(){
    this.viewVisit(new Visit({
      date: moment().format('YYYY-MM-DD'),
    }));
  }

 removeVisit(index:number){
   this.call.visits.splice(index,1);
 }

 viewVisit(visit:Visit){
   this.navCtrl.push(CallVisitPage,{visit:visit, call:this.call});
 }


}
