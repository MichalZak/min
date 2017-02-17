import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Placements } from '../../providers'; 

@Component({
  selector: 'page-visit-books',
  templateUrl: 'visit-books.html'
})
export class VisitBooksPage {

  items:Array<any>
  studyList:Array<any>
  proof:Array<any>
  family:Array<any>
  children:Array<any>
  videosFav:Array<any>
  proofFav:Array<any>
  BibleFav:Array<any>
  StudyFav:Array<any>
  ChildrenFav:Array<any>

   constructor(public viewCtrl: ViewController , 
              public placemenets: Placements) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitVideosPage');
  }

  ionViewWillEnter() {
    this.items = this.placemenets.getBooks();
    this.studyList = this.placemenets.getBooks().filter(doc=> (doc.category === 'study' && doc.type === 'book' ))

  }


  select(item:any){
    this.viewCtrl.dismiss(item);
  }

  exit(){
    this.viewCtrl.dismiss();
  }

}
