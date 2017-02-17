import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Auth } from '../../providers/auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {username: string, password: string} = {
    username: '',
    password: ''
  };

  constructor(public navCtrl: NavController,
              public auth: Auth,
              public toastCtrl: ToastController) {
  }

  // Attempt to login in through our Auth service
  doLogin() {
    // Attempt to login in through our Auth service
    this.auth.login(this.account).subscribe((res) => {
      console.log("LoginPage doLogin RES: " + JSON.stringify(res));
      //this.navCtrl.push(TabsPage);
      this.navCtrl.popToRoot();
    }, (err) => {
      console.log('Login -> doLogin ERROR: '+JSON.stringify(err));
      //this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint

      
      console.log("validationErrors: "+JSON.stringify(err._body));
      let message:string = "Unable to login in, please check your username/password";
        
      try{
        let body = JSON.parse(err['_body']);
        console.log("Body: ",body);
        
        if(body['message'] != null)
          message = body.message + ". ";

      }catch(err){
        console.log("Login-> doLogin, Error parsing message: ", err);
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




}
