import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Events, Platform } from 'ionic-angular'; 
import PouchDB from 'pouchdb';
import { generateId, saveIntoArray } from '../utils';
import { Doc } from '../models';
import { Auth } from './auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Settings } from './settings';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/first';


@Injectable()
export class DataProvider {

  private _pouch:any;
  private _pouchRemove:any;
  private _docs: BehaviorSubject<Doc[]>;
  private dataStore: {
    docs: Doc[]
  };

  private _syncOptions = {
      live: true,
      retry: true,
      continuous: true
    };

  constructor(private platform: Platform,
              private events: Events,
              public settings: Settings, 
              private auth:Auth) {
    console.log('Hello DataProvider');

    this.dataStore = {docs:[]};
    this._docs = <BehaviorSubject<Doc[]>>new BehaviorSubject([]);
    

    this.setupAuthEventListeners();



  }

  setupAuthEventListeners(){

    //see if we where authenticated before DataProvider was created
    if(this.auth.loggedIn())
    {
      let dbname:string  = this.settings.getValue('database_name');
      console.log("Got DBname: ", dbname);
      console.log(this.auth.user.dbs);
      //lets init databases
      this.initPouch(this.auth.user.username, this.auth.user.dbs[dbname]); 
    }
    else{
      this.initPouch("guest"); 
    }

    //load listen for login event, if so, connect to remote database
    this.events.subscribe(Auth.AUTH_LOGIN, ()=>{
          console.log("DataProvider Event Login");
          console.log("Auth Username: "+this.auth.user.username);
          console.log("User DBS: "+ this.auth.user.dbs)
          this.initPouch(this.auth.user.username, this.auth.user.dbs[this.settings.getValue('database_name')]);    
    });

    this.events.subscribe(Auth.AUTH_LOGOUT, ()=>{
      console.log('DataProvider Event Logout');
      this.disconectRemote();
    });
  }

  /* Get single doc by id */
  getDoc(id:string):Doc{
    return this.dataStore.docs.find((doc)=>{
      if(doc._id === id)
        return true;
      return false;
    })
  }

  getDocs(type:string){
    return  this.dataStore.docs.filter((doc)=> doc.type === type)
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
    //debugger;
    console.log('DataProvider->save doc: '+JSON.stringify(doc));
    //lets make sure we have an ID, if its new doc, lets generate new ID
    if(doc._id == null)
    {
      if(doc.type == null)
        doc.type = ""; //make doc be default
      doc._id = generateId(doc.type);
    }
       
    return this._pouch.put(doc)
      .catch(err=>{
        console.log('Datarovider Save Error:'+JSON.stringify(err));
      }); 
  }

  remove(doc:Doc): Promise<Doc>{
    return new Promise((res,rej) =>{
        this._pouch.get(doc._id).then((doc)=>{
            doc._deleted = true;
            res(this._pouch.put(doc));
        })
    });
  }

  addAttachment(doc:Doc, filename:string, type:string, file:any){
    return new Promise(resolve=>{
      //first lets make sure we have the file
      this._pouch.get(doc._id).then(res=>{
        console.log("Got doc", res);
        this._pouch.putAttachment(doc._id, filename, doc._rev, file, type).then(res =>{
          console.log('Added file', res);
        });
      }).catch(err=>{
        console.log("AddAttachment error loading doc: ", err);
        //save doc first then add attachments
        //make sure doc has a name
        this.save(doc).then(res2=>{
          console.log("Saved Doc", res2);
          this._pouch.putAttachment(res2.id, filename, res2.rev, file, type).then(res3 =>{
            console.log('Added file', res3);
        });
        })
      })

      
    })
  }

  getAttachment(doc:Doc, filename:string):Promise<any>{
    return new Promise(resolve=>{
      this._pouch.getAttachment(doc, filename).then(res=>{
        console.log("Got File", res); 
        resolve(res);
      }).catch(err=>{
        console.log("Error loading file:", err);
        resolve(null);
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



  private initPouch(pouchName:string, remotedb:string=""):Promise<any> {
    console.log('DataProvider->initDB localName: '+JSON.stringify(pouchName));
    return this.platform.ready().then(()=>{
      this._pouch = new PouchDB(pouchName);
      window['PouchDB'] = PouchDB;//make it visible for chrome extension

      //lets load all the data and then listen to all the changes
      //lets init db, and load all the docs
      this._pouch.allDocs({include_docs: true})
        .then(doc => {
          console.log("Init Docs: "+JSON.stringify(doc));
          //this.loadAllDocs(doc.rows);
          let state:Doc[] = doc.rows.map(row => row.doc);
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
         if(remotedb != "")
          this.initRemotePouch(remotedb);

        
    });//end of platform ready
  }


  
  private initRemotePouch(remotedb:string){
    console.log("DataProvider init Remote url: "+JSON.stringify(remotedb));    
    this._pouchRemove = new PouchDB(remotedb);

    this._pouch.sync(this._pouchRemove, this._syncOptions)
        .on('change', function (info) {
          // handle change
          console.log('DataProvider Pouch Sync OnChange:'+JSON.stringify(info));
        }).on('paused', function (err) {
          // replication paused (e.g. replication up to date, user went offline)
          console.log('DataProvider Pouch Sync OnPaused:'+JSON.stringify(err));
        }).on('active', function () {
          // replicate resumed (e.g. new changes replicating, user went back online)
          console.log('DataProvider Pouch Sync OnActive');
        }).on('denied', function (err) {
          // a document failed to replicate (e.g. due to permissions)
          console.log('DataProvider Pouch Sync OnDenied:'+JSON.stringify(err));
        }).on('complete', function (info) {
          // handle complete
          console.log('DataProvider Pouch Sync OnComplete:'+JSON.stringify(info));
        }).on('error', function (err) {
          // handle error
          console.log('DataProvider Pouch Sync OnErr:'+JSON.stringify(err));
        });

  }





  private disconectRemote(){
    //TODO: there needs to be a better way to stop sync
    this._pouchRemove = null;
  }


}