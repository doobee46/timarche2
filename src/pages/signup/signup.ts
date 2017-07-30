import {Component} from '@angular/core';
import 'rxjs/Rx'
import { NavController, NavParams,MenuController } from 'ionic-angular';
import { LoginPage }from "../login/login";
import { MainPage }from "../main/main";
import { BackandService } from '@backand/angular2-sdk'
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';

@Component({
  templateUrl: 'signup.html',
  selector: 'page-signup',
})
export class SignupPage {

  email:string = '';
  firstName:string = '';
  lastName:string = '';
  signUpPassword: string = '';
  confirmPassword: string = '';
  userData: any = {};

  constructor(public menuCtrl:MenuController, public navCtrl:NavController, private backand: BackandService, private fb: Facebook, private fbWeb: FacebookService) {
   this.menuCtrl.enable(false);
    console.log('signup');

    // if you want Ionic web app to be usuable if shared as link in Facebook
    let initParams: InitParams = {
      appId: '468419730208128',
      xfbml: true,
      version: 'v2.8'
    };
    fbWeb.init(initParams);
    ///////////
    
  }

  public signUp() {
    if (this.signUpPassword != this.confirmPassword){
      alert('Passwords should match');
      return;
    }
    this.backand.signup(this.firstName, this.lastName, this.email, this.signUpPassword, this.confirmPassword)
      .then((res: any) => {
          alert('Sign up succeeded');
          this.navCtrl.setRoot(MainPage);
          this.email = this.signUpPassword = this.confirmPassword = this.firstName = this.lastName = '';
      },
      (err: any) => {
        alert(err.data)
      }
    );
  }

  public socialWeb(provider: string): void {
    console.log('socialWeb', provider);
    switch(provider)
    {
      case 'facebook':
        this.fbWeb.login()
          .then((response: LoginResponse) => { 
            console.log('Logged into Facebook!', response); 
            if (response.status == 'connected'){
              this.userData = response;
              this.backand.socialSigninWithToken('facebook', response.authResponse.accessToken).then(
                  (resBackand: any) => {
                    console.log('social', resBackand);
                  }, 
                  (errBackand: any) => {
                    console.log('err', errBackand);
                  }
              );          
            }
            else {
              console.log('Facebook failed');
            }
          })
          .catch((error: any) => { 
            console.log('Error logging into Facebook', error); 
          });
      break;

      default:
      break;
    }
    
  }

  public inAppSocial(provider: string): void{
    console.log('inAppSocial', provider);
    if (provider == 'facebook'){
      this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => { 
        console.log('Logged into Facebook!', res); 
        if (res.status == 'connected'){
          this.userData = res;
          this.backand.socialSigninWithToken('facebook', res.authResponse.accessToken).then(
              (resBackand: any) => {
                console.log('social', resBackand);
              }, 
              (errBackand: any) => {
                console.log('err', errBackand);
              }
          );          
        }
        else {
          console.log('Facebook failed');
        }

      })
      .catch(e => { 
        console.log('Error logging into Facebook', e); 
      });
    }
 
  }

  login(){
     this.navCtrl.push(LoginPage);
 }


}
