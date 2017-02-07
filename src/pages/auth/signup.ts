import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Auth, AccountInfo } from '../../providers/auth';

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
    name:"",
    username:"",
    email:"",
    password: "",
    confirmPassword: ""
  };

  constructor(public navCtrl: NavController,
              public auth: Auth,
              public toastCtrl: ToastController) { }

  doSignup() {
    // Attempt to login in through our Auth service
    this.auth.signup(this.account).subscribe((res) => {
      console.log("SignupPage doSignup RES: " + JSON.stringify(res));
      //this.navCtrl.push(TabsPage);
    }, (err) => {
      console.log('Signup -> doSignup: '+JSON.stringify(err));
      //this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint

      let message:string = "Error, could not connect, please try at later time.";
      try{
        console.log("validationErrors: "+JSON.stringify(err._body));
        let body = JSON.parse(err._body);
        console.log("Body: "+JSON.stringify(body));
        console.log("Val Errors: "+JSON.stringify(body.validationErrors));
        message = "";
        if(body.validationErrors != null && body.validationErrors.email != null)
          message = message + " \n " + body.validationErrors.email+". ";

        if(body.validationErrors != null && body.validationErrors.username != null)
          message = message + " \n " + body.validationErrors.username+". ";
        
        if(body.validationErrors != null && body.validationErrors.password != null)
          message = message + " \n " + body.validationErrors.password+". ";


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
}
