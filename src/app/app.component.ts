import { Component } from '@angular/core';
import { App, Events, Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen, CodePush } from 'ionic-native';

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
              public alertCtrl: AlertController,
              auth: Auth, 
              events: Events) {

      platform.ready().then(() => {

        //lets see if the user is logged in
        //lets load settings, and wait for promise, then 
        //check if we are logged in, prevent race condition
        settings.load().then(res=>{
          //console.log("AppComponent -> Settings-> Load: "+JSON.stringify(res));
          console.log("App Component Load");
          console.log("AUTH USER: "+ auth.loggedIn() + ":: ", auth.user);
          console.log("SETTINGS: ", settings.getAll());

          if(settings.getValue(Auth.AUTH_SETTING_KEY) != null)
            auth.loadUser(settings.getValue(Auth.AUTH_SETTING_KEY));

          if(auth.loggedIn())
            events.publish(Auth.AUTH_LOGIN);
          
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

        events.subscribe('CODEPUSH_CHECK', ()=>{
          try{

            CodePush.checkForUpdate().then(update=> {
            let message = "";
            if (!update) {
                message = "The app is up to date.";
                console.log("The app is up to date.");
            } else {
                message = "An update is available! Should we download it?";
                console.log("An update is available! Should we download it?");
                CodePush.sync();
            }

            let prompt = this.alertCtrl.create({
            title: 'Remove Call',
            message: message,
              buttons: [
                {
                  text: 'OK',
                  handler: data=>{}//do nothing, just leave
                }
              ]
            });
            prompt.present();
          });


        } catch(err){
          let prompt = this.alertCtrl.create({
            title: 'Remove Call',
            message: err,
              buttons: [
                {
                  text: 'OK',
                  handler: data=>{}//do nothing, just leave
                }
              ]
            });
            prompt.present();
        }



        });//end of event subscribe
        


        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
        CodePush.sync();
        Splashscreen.hide();
    });
  }
}
