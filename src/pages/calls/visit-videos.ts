import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Placements } from '../../providers'; 


@Component({
  selector: 'page-visit-videos',
  templateUrl: 'visit-videos.html'
})
export class VisitVideosPage {

  items:Array<any>

  constructor(public viewCtrl: ViewController , 
              public placemenets: Placements) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitVideosPage');
  }

  ionViewWillEnter() {
    this.items = this.placemenets.getVideos();
  }


  select(item:any){
    this.viewCtrl.dismiss(item);
  }

  exit(){
    this.viewCtrl.dismiss();
  }

}
