import { Component } from '@angular/core';
import { NavController,ViewController,IonicPage, NavParams,Loading,ToastController,LoadingController,ActionSheetController,Platform} from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { BackandService } from '@backand/angular2-sdk'
import { CategoryPage } from '../category/category';

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
  category;
  categories:any[] = [];
  location;
  user;
  api_url:any ="https://api.cloudinary.com/v1_1/doobee46/auto/upload";
  public listings:any[] = [];
 

  constructor(private backand:BackandService,public viewCtrl:ViewController,public navCtrl: NavController, public navParams: NavParams,private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath,
  public actionSheetCtrl: ActionSheetController, public loadingCtrl:LoadingController,public toastCtrl: ToastController,public platform: Platform) {
   this.getCategories();
   this.user = this.navParams.get('user');
   console.log(this.user);
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
  this.backand.object.create('Listings',
      { 
        title: this.title,
        description :this.description,
        price:this.price,
        flag:this.flag,
        poster_url:this.poster_url,
        user:this.user,
        category:this.category,
        location:this.location 
      
      }).then((res: any) => {
        // add to beginning of array
        this.listings.unshift({ id: null, 
        title: this.title, 
        description: this.description,
        price:this.price,
        flag:this.flag,
        poster_url:this.poster_url,
        user:this.user,
        category:this.category,
        location:this.location,
         });

          this.title= '';
          this.description = '';
          this.price='';
          this.flag='';
          this.poster_url='';
          this.user= this.user;
          this.category = '';
          this.location ='';
        },
        (err: any) => {
        alert(err.data);
      }
    );
  }


  public uploadImage() {
  // Destination URL
  var url = this.api_url;
 
  // File for Upload
  var targetPath = this.pathForImage(this.lastImage);
 
  // File name only
  var filename = this.lastImage;
 
  var options = {
    fileKey: "file",
    fileName: filename,
    chunkedMode: false,
    mimeType: "multipart/form-data",
    params : {'fileName': filename,
              'upload_preset': 'cxgjr10k'
    } 
  };
 
  const fileTransfer: TransferObject = this.transfer.create();
 
  this.loading = this.loadingCtrl.create({
    content: 'Uploading...',
  });
  this.loading.present();
 
  // Use the FileTransfer to upload the image
  fileTransfer.upload(targetPath, url, options).then(data => {
    console.log(this.poster_url);
    this.loading.dismissAll()
    this.presentToast('Image succesful uploaded.');
  }, err => {
    this.loading.dismissAll()
    this.presentToast('Error while uploading file.');
  });
}

  public getCategories() {
   this.backand.object.getList('categories')
    .then((res: any) => {
      this.categories = res.data;
    },
    (err: any) => {
      alert(err.data);
    });
 }

}
