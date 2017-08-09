import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import io from 'socket.io-client';
window["io"] = io;
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { CrudPage } from '../pages/crud/crud';
import { MainPage } from '../pages/main/main';
import { UploadformPage } from '../pages/uploadform/uploadform';
import { CategoryPage } from '../pages/category/category';
import { ChatsPage } from '../pages/chats/chats';
import { ListingDetailsPage } from '../pages/listing-details/listing-details';
import { LocationComponent } from '../components/location/location';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';
import { BackandService } from '@backand/angular2-sdk';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


// In App Login only

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

// Facebook login for Ionic web shared in Facebook
import { FacebookModule } from 'ngx-facebook';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    CrudPage,
    MainPage,
    CategoryPage,
    LocationComponent,
    ListingDetailsPage,
    UploadformPage,
    ChatsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FacebookModule.forRoot(),
    IonicStorageModule.forRoot(),
    IonicImageViewerModule
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    CrudPage,
    MainPage,
    CategoryPage,
    LocationComponent,
    ListingDetailsPage,
    UploadformPage,
    ChatsPage
  ],
  providers: [ 
    StatusBar,
    SplashScreen,
    BackandService,
    File,
    Transfer,
    Camera,
    FilePath, 
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook
  ]
})
export class AppModule {}
