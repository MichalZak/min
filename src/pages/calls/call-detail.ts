import { Component, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import * as _ from "lodash"
import { Call, Visit } from '../../models';
import { DataProvider } from '../../providers';
import { Api } from '../../providers';
import { CallVisitPage } from './call-visit';
import * as moment from 'moment';


@Component({
  selector: 'page-call-detail',
  templateUrl: 'call-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallDetailPage {

  public call:Call = new Call();
  public oldCall:Call;
  public subscription:any;
  minDate:any;
  maxDate:any;

  

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public dataProvider: DataProvider,
              private ref: ChangeDetectorRef,
              public api: Api,
              public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
  }

  ionViewDidEnter(){
    console.log("IonViewDidEnter: ", this.call);
    this.ref.markForCheck();
  }

  ionViewWillEnter() {
    console.log("****Ionview Will Enter");
    
    this.subscription = this.dataProvider.getDocObservable(this.navParams.get('call')).subscribe(
      doc =>{
        this.call = Object.assign({}, doc);
        console.log("CallDetail Call Update", this.call);
        this.oldCall = Object.assign({}, doc);
        this.ref.markForCheck();
        //this.ref.detectChanges();
      }
    );


    
    
    /*
    if(this.dataProvider.tempStore['call'] != null)
    {
      console.log("we are loading from tempStore");
      this.call = Object.assign({}, this.dataProvider.tempStore['call']);
      this.dataProvider.tempStore['call'] = null;
      //we are returning from visit view, so lets save
      this.dataProvider.save(this.call).then(res=>{
        console.log("SAVED CALL RES: ", res);
        //lets reload the saved object
        this.call = Object.assign({}, this.dataProvider.getDoc(res.id));
        this.oldCall = Object.assign({}, this.call);
        console.log("IONVIEW ENTER: ", this.call);
        this.ref.markForCheck();

      })

    }
    else
    {
      this.call = Object.assign({}, this.navParams.get("call"));
      this.oldCall = Object.assign({}, this.call);
      console.log("IONVIEW ENTER: ", this.call);
      this.ref.markForCheck();
    }
    
    this.minDate = moment.utc().startOf('day').subtract(1,'y').format('YYYY-MM-DD');
    this.maxDate = moment.utc().add(2, 'y').format('YYYY-MM-DD');
    */
  }

  ionViewWillLeave(){
    this.save(); 
    this.subscription.unsubscribe();
  }

  save(){

    //are we saving?
    console.log("Are we saving?");
    //lets see if changes where made
    if(_.isEqual(this.call, this.oldCall))
      return; //no changes have been make, no need to save

    console.log("Yes we are: ", this.call);
    this.dataProvider.save(this.call);
 }
 setBackDate(){
   console.log("setting up call back date");
   this.call.date =  moment().format('YYYY-MM-DD');
 }

 addVisit(){
    this.viewVisit(new Visit({
      id: Date.now(),
      date: moment().format('YYYY-MM-DD'),
    }));
  }

 removeVisit(index:number){
   this.call.visits.splice(index,1);
 }

 viewVisit(visit:Visit){
   this.dataProvider.tempStore['call'] = null;
   this.navCtrl.push(CallVisitPage,{visit:visit, call:this.call});
 }


}
