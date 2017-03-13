import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Settings } from './settings';
import 'rxjs/add/operator/map';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string;
  dbUrl:string;

  constructor(public http: Http, public settings: Settings,) {
  }


  get(endpoint: string, params?: any,  url?:string, options?: RequestOptions) {
    if(!url)
      url = this.settings.getValue('web_url');

    if (!options) {
      options = new RequestOptions();
    }

    // Support easy query params for GET requests
    if (params) {
      let p = new URLSearchParams();
      for(let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }

    console.log('URL', url);
    console.log("URL: "+url+"/"+ endpoint);
    console.log("OPTIONS", options);

    return this.http.get(url + '/' + endpoint, options);
  }

  post(endpoint: string, body: any, options?: RequestOptions) {
    let url = this.settings.getValue('web_url');
    console.log('api-> Post: '+ url + '/' + endpoint);
    console.log('body: '+JSON.stringify(body));
    console.log('options: '+JSON.stringify(options));

    return this.http.post(url +'/'+ endpoint, body, options);
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }

  delete(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(this.url + '/' + endpoint, body, options);
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }
}
