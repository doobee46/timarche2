import { Component, ViewChild} from '@angular/core';
import { Platform, Nav, MenuController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { BackandService } from '@backand/angular2-sdk';

@Component({
  templateUrl: 'app.html'
})
// @Component({
//   template: `<h1>Hello World!</h1>`
// })
export class MyApp {
  auth_status:string = null;
  rootPage;
  
  constructor(public menuCtrl:MenuController,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private backand:BackandService) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      backand.init({
        appName: 'timarche',
        signUpToken: '805ea954-a27a-4749-9b14-61953d534631',
        anonymousToken: 'b22770c0-c73b-42b8-b25c-72a5febb01a0',
        runSocket: true,
        mobilePlatform: 'ionic'
      });
      this.rootPage = SignupPage;
    });
  }

  
}

 