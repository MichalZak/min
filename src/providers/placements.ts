import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular'; 
import {Placement } from '../models';
import { Settings } from './settings';
import PouchDB from 'pouchdb';
import { Doc } from '../models';
import 'rxjs/add/operator/map';


@Injectable()
export class Placements {

  private _pouch:any;
  private _pouchRemote:any;
  private _docs:Array<Placement>;

  private _localPouchOptions = {
    revs_limit: 10,
    auto_compaction: true
  } 


  constructor(private platform: Platform,
              public settings: Settings) {
    console.log('Hello Placements Provider');
  }


  getDocs(){
    return this._docs;
  }

  //Call this when loading app
  public syncData(){
    this.initPouch("min_publications", true);
  }



  private initPouch(pouchName:string, connectRemote:boolean=false):Promise<any> {
    console.log('DataProvider->initDB localName: '+JSON.stringify(pouchName));
    return this.platform.ready().then(()=>{
      this._pouch = new PouchDB(pouchName, this._localPouchOptions);
      window['PouchDB'] = PouchDB;//make it visible for chrome extension

      //lets load all the data and then listen to all the changes
      //lets init db, and load all the docs
      this._pouch.allDocs({include_docs: true})
        .then(doc => {
          console.log("Init Docs: "+JSON.stringify(doc));
          //this.loadAllDocs(doc.rows);
          let state:Placement[] = doc.rows.map(row => new Placement(row.doc));
          this.loadAllDocs(state);

        });

      
      //now watch for changes
      this._pouch.changes({live: true, since: 'now', include_docs:true})
        .on('change', change => {
           console.log('Changes obj:'+JSON.stringify(change));
           if (change['deleted']) {
                this.removeSuccessful(change.doc);
            } 
            else {
              console.log('PouchChange:'+JSON.stringify(change));
              this.saveSuccessful(change.doc); 
            }
         })

      //connect to remote 
      if(connectRemote)
          this.initRemotePouch();

        
    });//end of platform ready
  }

  
  private initRemotePouch(){
    let db = this.settings.getValue("database_publications");

    this._pouchRemote = new PouchDB(db);

    this._pouch.replicate.from(this._pouchRemote, {
      filter: 'myFilters/languageFilter',
      query_params: {
        languages: ['E', 'CHS' ]
      },
      live: false,
      retry: false,})
        .on('change', function (info) {
          // handle change
          console.log('DataProvider Pouch Sync OnChange:', info);
        }).on('paused', function (err) {
          // replication paused (e.g. replication up to date, user went offline)
          console.log('DataProvider Pouch Sync OnPaused:', err);
        }).on('active', function () {
          // replicate resumed (e.g. new changes replicating, user went back online)
          console.log('DataProvider Pouch Sync OnActive');
        }).on('denied', function (err) {
          // a document failed to replicate (e.g. due to permissions)
          console.log('DataProvider Pouch Sync OnDenied:', err);
        }).on('complete', function (info) {
          // handle complete
          console.log('DataProvider Pouch Sync OnComplete:', info);
        }).on('error', function (err) {
          // handle error
          console.log('DataProvider Pouch Sync OnErr:', err);
        });

  }

  private loadAllDocs(docs:Placement[]){
    this._docs = docs;
  }

    private removeSuccessful(doc:any){
    //console.log('DocReducer->REMOVE_SUCCESS: '+JSON.stringify(doc));
    this._docs = this._docs.filter(d=>d._id !== doc._id);

  }

  private saveSuccessful(doc:any){
    //we have changes being made to pub database
    console.log("*****CHANGES BEING MADE", doc);
    this._docs = this.saveIntoArray(doc, this._docs);
    //need to load image file
    //TODO: check if the image exists, if not upload it
  }


  saveIntoArray(item:Object, ary:Array<any>, idKey:string='_id'):Array<any>{
  var i = this.getIndexById(item[idKey],ary,idKey);
      if(i== -1)
        i=ary.length;
      return [  ...ary.slice(0, i),
                new Placement(Object.assign({},item)),
                ...ary.slice(i + 1) ]
  }
  getIndexById(id:string, ary:any, idKey:string = '_id'):number{
   for(var i = 0; i < ary.length; i++){
        if(id === ary[i][idKey])
          return i;
      }

      //if we don't have a match return null
      return -1;
  }

























  getBooks2():Placement[]{
    return [
      new Placement({_id: 'pub/book/bh', name: 'Bible Teach', fullName: 'What Does the Bible Really Teach?', shortName: 'bh', type:"book", category: "study"}), 
      new Placement({_id: 'pub/book/nwt', name: 'NWT Bible', shortName: 'nwt', type:"book", category: "study"}), 

      new Placement({_id: 'pub/book/lc', name: 'Was Life Created?', shortName: 'lc', type:"book"}),
      new Placement({_id: 'pub/book/lf', name: 'The Origin of Life—Five Questions Worth Asking', shortName: 'lf', type:"book"}), 
      new Placement({_id: 'pub/book/hf', name: 'Your Family Can Be Happy', shortName: 'hf', type:"book"}), 
      new Placement({_id: 'pub/book/bhs', name: 'Teach Us?', shortName: 'bhs', type:"book", category: "study"}), 
      new Placement({_id: 'pub/book/pc', name: 'Peace&Happiness', shortName: 'pc', type:"book", category: "study"}), 
      new Placement({_id: 'pub/book/fb', name: 'Good News From God!', shortName: 'fb', type:"book"}), 
      new Placement({_id: 'pub/book/jl', name: 'Jehovah’s Will?', shortName: 'jl', type:"book", category: "study"}), 
      new Placement({_id: 'pub/book/yp1', name: 'Questions Young People Ask 1', shortName: 'yp1', type:"book"}), 
      new Placement({_id: 'pub/book/yp2', name: 'Questions Young People Ask 2', shortName: 'yp2', type:"book"}), 
      new Placement({_id: 'pub/book/ll', name: 'Listen to God and Live Forever', shortName: 'll', type:"book"}), 
      new Placement({_id: 'pub/book/lr', name: 'Learn From the Great Teacher', shortName: 'lr', type:"book"}), 
      new Placement({_id: 'pub/book/lv', name: 'God’s Love', shortName: 'lv', type:"book", category: "study"}), 
      new Placement({_id: 'pub/book/cl', name: 'Draw Close to Jehovah', shortName: 'cl', type:"book"}), 
      new Placement({_id: 'pub/book/my', name: 'My Book of Bible Stories', shortName: 'my', type:"book"}), 
    ];
  }

  getTracts(){
    
  }

  getVideos2():Placement[]{
   return [
      new Placement({_id: 'pub/video/', name: 'Why Study the Bible?', type:"video"}),
      new Placement({_id: 'pub/video/', name: 'Who Is the Author of the Bible?', type:"video"}),
      new Placement({_id: 'pub/video/',name: 'How Can We Be Sure the Bible Is True?', type:"video"}),
      new Placement({_id: 'pub/video/',name: 'What Happens at a Kingdom Hall?', type:"video"}),
      new Placement({_id: 'pub/video/',name: 'Was Life Created? Introduction', type:"video"}),
      new Placement({_id: 'pub/video/',name: 'Does God Have a Name?', type:"video"}),
      new Placement({_id: 'pub/video/',name: 'Why Did Jesus Die?', type:"video"}),
      new Placement({_id: 'pub/video/',name: 'Strength Comes From Serving Jehovah', type:"video"}), 
      new Placement({_id: 'pub/video/', name: 'I Got Fed Up With My Lifestyle', type:"video"}),
    ]
  }

}
