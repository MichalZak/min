import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Placements } from '../../providers'; 
import { Placement } from '../../models';

@Component({
  selector: 'page-visit-placements',
  templateUrl: 'visit-placements.html'
})
export class VisitPlacementsPage {

  books:Placement[];
  tracts:Placement[];
  mags:Placement[];
  videos_whiteboard:Placement[];
  videos_tools:Placement[];
  videos_transforms_lives:Placement[];
  videos_interviews:Placement[];

  other:Array<any>; //other book, other video, other tract... write detail in notes section

   constructor(public viewCtrl: ViewController , 
              public placemenets: Placements) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitVideosPage');
  }

  ionViewWillEnter() {
    //this.items = this.placemenets.getBooks();
    //this.studyList = this.placemenets.getBooks().filter(doc=> (doc.category === 'study' && doc.type === 'book' ))


    let docs = this.placemenets.getDocs().filter(doc => doc.language==='E');

    this.books = docs.filter(doc=>doc.pubType === 'book').sort(this.sortFunction);
    this.tracts = docs.filter(doc=>doc.pubType === 'tract').sort(this.sortFunction);
    this.mags = docs.filter(doc=>doc.pubType === 'mag/a' || doc.pubType === 'mag/w').sort(this.sortMags);
    
    let videos = docs.filter(doc=> doc.pubType === 'video');
    console.log("videos", videos);
    this.videos_whiteboard = videos.filter(doc => doc.category === 'whiteboard').sort(this.sortFunction);
    this.videos_tools = videos.filter(doc => doc.category === 'tools').sort(this.sortFunction);
    this.videos_transforms_lives = videos.filter(doc => doc.category === 'transforms_lives').sort(this.sortFunction);
    this.videos_interviews = videos.filter(doc=>doc.category === 'interviews').sort(this.sortFunction);

  }

  sortFunction(a:Placement, b:Placement){
    if(a.getPriority() < b.getPriority())
      return 1;
    if(a.getPriority() > b.getPriority())
      return -1;
    if(a.name < b.name)
      return -1;
    if(a.name > b.name)
      return 1;
    return 0;
  }

  sortMags(a:Placement, b:Placement){
    if(a.name < b.name)
      return 1;
    if(a.name > b.name)
      return -1;
    return 0;
  }


  select(item:any){
    this.viewCtrl.dismiss(item);
  }

  exit(){
    this.viewCtrl.dismiss();
  }

}
