import { Component, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { NavController, AlertController, MenuController, } from 'ionic-angular';

import { generateId } from '../../utils';
import { CallDetailPage } from '../';
import { Call } from '../../models';
import { DataProvider } from '../../providers';


interface OrderBy {
    date?:string,
    rating?:string,
    type?:string,
    asc?:string,
    desc?:string,
}


@Component({
  selector: 'page-call-list',
  templateUrl: 'call-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallListPage {

  public calls:Call[];
  public subscription:any;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private ref: ChangeDetectorRef,
              public menuCtrl: MenuController,
              public dataProvider: DataProvider) {

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad');

    this.subscription = this.dataProvider.getDocsObservable('call').subscribe(
      docs =>{
        //onNext
        //console.log(docs);

        this.calls = docs.sort((a,b)=>{
          //sort by priority->date->name
          if(a.priority < b.priority)
            return 1;

          if(a.priority > b.priority)
            return -1;

          if(a.date < b.date)
            return -1;

          if(a.date > b.date)
            return 1;

          if(a.name < b.name)
            return -1;

          if(a.name > b.name)
            return 1;

          return 0;
        });
        //this.ref.detectChanges();
        this.ref.markForCheck();
      },
      err =>{
        //onError
        console.log(err);
      },
      () =>{
        //onComplted
        console.log("Subscription Completed");
      }
    );
  }

  ionViewWillUnload(){
    this.subscription.dispose();
  }

  view(id:string){
    this.navCtrl.push(CallDetailPage,{call:id});
  }

  add(){

    let c = new Call({_id: generateId("call"),
      type: "call"
    });

    this.dataProvider.save(c)
    .then(res=>{
      this.view(res.id);
    })
    .catch(err=>{
      console.log("ERROR CREATING CALL", err);
    });  
  }

  remove(item:any){
    let prompt = this.alertCtrl.create({
      title: 'Remove Call',
      message: "Are you sure you want to delete this call?",
      buttons: [
        {
          text: 'Cancel',
          handler: data=>{}//do nothing, just leave
        },
        {
          text: 'Remove',
          handler: data => {
            this.dataProvider.remove(item)
          }
        }
      ]
    });
    prompt.present();
  
  }


}
