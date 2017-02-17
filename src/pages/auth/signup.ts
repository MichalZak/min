import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { Auth, AccountInfo } from '../../providers/auth';
import { DataProvider } from '../../providers';


/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account:AccountInfo = {
    //name:"",
    username:"",
    //email:"",
    password: "",
   //confirmPassword: ""
  };

  docBackup:Array<any>;

  constructor(public navCtrl: NavController,
              public auth: Auth,
              public alertCtrl: AlertController,
              public dataProvider: DataProvider,
              public toastCtrl: ToastController) { }

  doSignup() {
    //lets backup our docs 
    this.docBackup = this.dataProvider.getAllDocs();
    // Attempt to login in through our Auth service
    this.auth.signup(this.account).subscribe((res) => {
    console.log("SignupPage doSignup RES: " + JSON.stringify(res));

    this.mergeGuestData();



      //this.navCtrl.push(TabsPage);
    }, (err) => {
      console.log('Signup -> doSignup: '+JSON.stringify(err));
      //this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint
      this.mergeGuestData();

      let message:string = "Error, could not connect, please try at later time.";
      try{
        console.log("validationErrors: "+JSON.stringify(err._body));
        let body = JSON.parse(err._body);
        console.log("Body: "+JSON.stringify(body));
      
        message = "";

        if(!body['ok'])
        {
          console.log("Error Found");
          message = body['error'];
        }


      }catch(err){
        console.log("Error parsing Signup request: ",err);
      }
      
      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  checkUnique(field:string){
    console.log("Signup-> checkUnique");
  }

  mergeGuestData(){
    if(this.docBackup.length > 0)
    {
      let prompt = this.alertCtrl.create({
      title: 'Merge Guest Data',
      message: "Would you like to save your current application data into your new account?",
      buttons: [
        {
          text: 'No',
          handler: data=>{
            this.navCtrl.popToRoot();
          }//do nothing, just leave
        },
        {
          text: 'Yes',
          handler: data => {
            this.docBackup.forEach(doc =>{

              this.dataProvider.save(Object.assign({}, doc, {_rev: null}));
            })
            this.navCtrl.popToRoot();
          }
        }
      ]
    });
    prompt.present();
    }
    else
    {
      this.navCtrl.popToRoot();
    }
  }
}
