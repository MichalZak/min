import { Component } from '@angular/core';
import { App, Events, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

//prividers
import { Settings } from '../providers';
import { Auth } from '../providers/auth';

//pages
import { TabsPage } from '../pages/';
//import { WelcomePage } from '../pages/';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
 
  rootPage:any;

  constructor(app: App,
              platform: Platform,
              settings: Settings,
              auth: Auth, 
              events: Events) {

      platform.ready().then(() => {

        //lets see if the user is logged in
        //lets load settings, and wait for promise, then 
        //check if we are logged in, prevent race condition
        settings.load().then(res=>{
          //console.log("AppComponent -> Settings-> Load: "+JSON.stringify(res));
          //if(auth.loggedIn())
          //  events.publish(Auth.AUTH_LOGIN);
          //else
          //  this.rootPage = WelcomePage;
          this.rootPage = TabsPage;

        }).catch(err=>{
          console.log("AppComponent -> Settings-> ERROR: "+JSON.stringify(err));
          console.error(err);
        });


        events.subscribe(Auth.AUTH_LOGOUT, ()=>{
          console.log("App Components Event Logout");

          //app.getRootNav().setRoot(WelcomePage);
          
        });

        events.subscribe(Auth.AUTH_LOGIN, ()=>{
          //console.log("App Components Event Login");
          //app.getRootNav().setRoot(TabsPage);
          
        });


        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
        Splashscreen.hide();
    });
  }
}
