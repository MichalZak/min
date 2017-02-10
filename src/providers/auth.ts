import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
//import { Http } from '@angular/http';
import { User } from '../models';
import { Api } from './api';
import { Settings } from './settings';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/share';



export interface AccountInfo{
  name?:string; 
  username?:string;
  email?:string;
  password?: string;
  confirmPassword?:string;
}


@Injectable()
export class Auth {


  static AUTH_LOGIN:string = "AUTH_LOGIN";
  static AUTH_LOGOUT:string = "AUTH_LOGOUT";
  static AUTH_SETTING_KEY:string = "AUTH";

  private _user: User;

  constructor(public settings: Settings, 
              public events: Events,
              public api: Api) {
    console.log('Hello Auth Provider');
  }


  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('_auth', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        console.log("Auth Login: "+JSON.stringify(res));
        this._loggedIn(res);
      }, err => {
        console.log('Singin ERROR: '+JSON.stringify(err));
        //need to  show that its an error
      });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: AccountInfo) {
    let seq = this.api.post('_adduser', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        console.log("Auth-> singup->result: "+JSON.stringify(res));
        this._loggedIn(res);

      }, err => {
        console.log('Singup ERROR: '+JSON.stringify(err));
      });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
    this.settings.setValue(Auth.AUTH_SETTING_KEY, {});
    this.events.publish(Auth.AUTH_LOGOUT);
    //nav.setRoot(WelcomePage);
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(res) {
    console.log("Auth _loggedIN: "+JSON.stringify(res));

    this._user = new User({
      token: res.token,
      password: res.password,
      username: res.user_id,
      dbs: res.userDBs,
      token_issued: res.issued,
      token_expires: res.expires
    });

    this.settings.setValue(Auth.AUTH_SETTING_KEY,this._user);
    this.events.publish(Auth.AUTH_LOGIN);
  }

  /**
   * See if user is logged in
   */
  loggedIn():boolean{
    //lets see if we have user credentials stored
    let user:User = new User(this.settings.getValue(Auth.AUTH_SETTING_KEY));
    
    if(user.token_expires)
      if(Date.now() > user.token_expires )
        return false;//token expired

    if(user.token_expires)  
      console.log("Token Life: "+ new Date(user.token_expires).toDateString());

    console.log("Checking loggedIn Stored User: " + JSON.stringify(user));


    if(user == null)
      return false;
    
    if(user.username == null || user.username == "")
      return false;

    this._user = user;
    
    return true;
  }
  
  get user(){
    return this._user;
  }
}
