import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Placements } from '../../providers'; 

@Component({
  selector: 'page-visit-books',
  templateUrl: 'visit-books.html'
})
export class VisitBooksPage {

  items:Array<any>

   constructor(public viewCtrl: ViewController , 
              public placemenets: Placements) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitVideosPage');
  }

  ionViewWillEnter() {
    this.items = this.placemenets.getBooks();
  }


  select(item:any){
    this.viewCtrl.dismiss(item);
  }

  exit(){
    this.viewCtrl.dismiss();
  }

}
