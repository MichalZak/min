import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
//import { Http } from '@angular/http';
import { User } from '../models';
import { Api } from './api';
import { Settings } from './settings';
import { RequestOptions, Headers} from '@angular/http';
import { Base64 } from '../base64';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/share';



export interface AccountInfo{
  //name?:string; 
  username?:string;
  //email?:string;
  password?: string;
  ///confirmPassword?:string;
}


@Injectable()
export class Auth {


  static AUTH_LOGIN:string = "AUTH_LOGIN";
  static AUTH_LOGOUT:string = "AUTH_LOGOUT";
  static AUTH_SETTING_KEY:string = "AUTH";

  private _user: User;
  private _headers:Headers;

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

    let base:Base64 = new Base64();
    let auth =  "Basic "+ base.encode(accountInfo.username+":"+accountInfo.password);
    let headers:Headers = new Headers({Authorization:auth});
    let options:RequestOptions = new RequestOptions();
    options.headers = headers;
    options.withCredentials = true;

    let seq = this.api.get('_auth', null, null, options).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        console.log("Auth Login: "+JSON.stringify(res));
        this._headers = headers;
        this.loadUser(accountInfo);
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

        this.loadUser(accountInfo);

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
    this.api.get("_logout");
  }

  /**
   * Process a login/signup response to store user data
   */
   loadUser(accountInfo: AccountInfo) {
    let base:Base64 = new Base64();
    let auth =  "Basic "+ base.encode(accountInfo.username+":"+accountInfo.password);
    this._user = new User({
      username: accountInfo.username,
      password: accountInfo.password,
      header: auth
    });

    this.settings.setValue(Auth.AUTH_SETTING_KEY,this._user);
    this.events.publish(Auth.AUTH_LOGIN);
  }

  /**
   * See if user is logged in
   */
  loggedIn():boolean{
    return (this._user != null && this._user.username != null && this._user.username != "" && this._user.username != "guest")
  }
  
  get user(){
    return this._user;
  }
}
