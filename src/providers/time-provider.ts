import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular'; 
import PouchDB from 'pouchdb';
import { saveIntoArray } from '../utils';
import { Doc } from '../models';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/first';


@Injectable()
export class TimeProvider {

  private _pouch:any;
  private _docs: BehaviorSubject<Doc[]>;
  private dataStore: {
    docs: Doc[],
  };

  private _localPouchOptions = {
    revs_limit: 3,
    auto_compaction: true
  } 

  constructor( public platform: Platform) {
    console.log('Hello TimeProvider');

    this.dataStore = {docs:[], };
    this._docs = <BehaviorSubject<Doc[]>>new BehaviorSubject([]);
    
  }

  init():Promise<any>{
    return new Promise((resolve,reject) =>{
      this.initPouch('min-notes-time').then(()=>{
        resolve(true);
      });
    });
  }

  /* Get single doc by id */
  getDoc(id:string):Doc{
    let d =  this.dataStore.docs.find((doc)=>{
      if(doc._id === id)
        return true;
      return false;
    })
    if(!d)
      return null;
    return d;
  }

  getDocs(type:string = null){
    if(type)
      return  this.dataStore.docs.filter((doc)=> doc.type === type)
    return this.dataStore.docs;
  }

  getAllDocs(){
    return this.dataStore.docs;
  }

  getDocObservable(id:string):Observable<any> {
    return this._docs.asObservable().map(doc => {
      return doc.find(doc => doc._id === id);
    })
  }

  getDocsObservable(type:string):Observable<any> {
    if(type == null)
      return this._docs.asObservable();

    //lets filter by type
    return this._docs.asObservable().map(doc => {
      return doc.filter((doc,idx)=> doc.type === type)
    }).do(doc =>{
     // console.log('Filter docs:'+JSON.stringify(doc));
    })
  }


  save(doc:Doc): Promise<any>{
    return new Promise((resolve,reject) =>{
      console.log('DataProvider->save doc: ', doc);
      this._pouch.put(doc)
        .then((res)=>{
          resolve(res);
        })
        .catch(err=>{
          console.log('Datarovider Save Error:'+JSON.stringify(err));
          reject(err);
        }); 
      })
  }

  remove(doc:Doc): Promise<Doc>{
    return new Promise((res,rej) =>{
        this._pouch.get(doc._id).then((doc)=>{
            doc._deleted = true;
            res(this._pouch.put(doc));
        })
    });
  }


  private removeSuccessful(doc:Doc){
    //console.log('DocReducer->REMOVE_SUCCESS: '+JSON.stringify(doc));
    this.dataStore.docs = this.dataStore.docs.filter(d=>d._id !== doc._id);
    //console.log('remove filter:'+JSON.stringify(this.dataStore.docs));
    this._docs.next(this.dataStore.docs);
  }

  private saveSuccessful(doc:Doc){
    //this.dataStore.docs.push(doc);
    //console.log('Save successfull:'+JSON.stringify(this.dataStore.docs));
    this.dataStore.docs = saveIntoArray(doc, this.dataStore.docs);
    this._docs.next(this.dataStore.docs);
  }


  private loadAllDocs(docs:Doc[]){
    this.dataStore.docs = docs;
    this._docs.next(this.dataStore.docs);
  }



  private initPouch(pouchName:string, connectRemote:boolean=false):Promise<any> {
    return new Promise((resolve,reject) =>{

      console.log('TimeProvider->initDB localName: '+JSON.stringify(pouchName));
      this.platform.ready().then(()=>{
        this._pouch = new PouchDB(pouchName+"_min", this._localPouchOptions);
        window['PouchDBTime'] = PouchDB;//make it visible for chrome extension

        //lets load all the data and then listen to all the changes
        //lets init db, and load all the docs
        this._pouch.allDocs({include_docs: true})
          .then(doc => {
            console.log("Init Time Docs: "+JSON.stringify(doc));
            //this.loadAllDocs(doc.rows);
            let state:Doc[] = doc.rows.map(row => row.doc);
            this.loadAllDocs(state);
            resolve(true);     

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
        
      });//end of platform ready
    });//end of promies
    
  }



}
