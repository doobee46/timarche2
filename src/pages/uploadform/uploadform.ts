import { Component } from '@angular/core';
import { NavController,ViewController,IonicPage, NavParams,Loading,ToastController,LoadingController,ActionSheetController,Platform} from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { BackandService } from '@backand/angular2-sdk'

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-uploadform',
  templateUrl: 'uploadform.html',
})
export class UploadformPage {
  lastImage: string = null;
  loading: Loading;
  title;
  description;
  price;
  flag;
  poster_url;
  user;
  category;
  location;
  public listings:any[] = [];

  constructor(private backand:BackandService,public viewCtrl:ViewController,public navCtrl: NavController, public navParams: NavParams,private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath,
  public actionSheetCtrl: ActionSheetController,public toastCtrl: ToastController,public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadformPage');
  }

   presentActionSheet() {
     let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source to post',
      buttons: [
        {
          text: 'Load from Library',
          icon: !this.platform.is('ios') ? 'images' : null,
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  
  }

  public takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };
 
  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }
  }, (err) => {
    this.presentToast('No image was selected.');
  });
}

// Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
  }, error => {
    this.presentToast('Error while storing file.');
  });
}
 
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
 
// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}

closeModal() {
    this.navCtrl.pop();
}

public postNewListing() {
  let listing = {
      title: this.title,
      description : this.description,
      price:this.price,
      flag:this.flag,
      poster_url:this.poster_url,
      user:this.user,
      category:this.category,
      location:this.location
  };

    if (listing.title && listing.description) {
      this.backand.object.create('Listings', listing)
      .then((res: any) => {
        // add to beginning of array
        this.listings.unshift({ id: null, 
        title: this.title, 
        description: this.description,
        price:this.price,
        flag:this.flag,
        poster_url:this.poster_url,
        user:this.user,
        category:this.category,
        location:this.location });

        this.title= '';
        this.description = '';
        this.price='';
        this.flag='';
        this.poster_url='';
        this.user= '';
        this.category = '';
        this.location ='';
      },
      (err: any) => {
        alert(err.data);
      });
    }
  }

}
