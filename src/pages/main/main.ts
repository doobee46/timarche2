import { ViewChild,Component } from '@angular/core';
import { NavController,Content,NavParams,Events,
LoadingController,ActionSheetController,MenuController,
Platform,ModalController,PopoverController  } from 'ionic-angular';
import { CategoryPage } from '../category/category';
import { UploadformPage } from '../uploadform/uploadform';
import { Storage } from '@ionic/storage';
import { LocationComponent } from '../../components/location/location';
import { ListingDetailsPage } from '../listing-details/listing-details';


import 'rxjs/add/operator/map';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  @ViewChild(Content) content: Content;

  public listings:any[] = [];
  category:any;
  categoryName:string ="Electronic";
  favorites = [];
  selectedCity:string="Delmas";
  products = [
  {
    id:1,
    title: 'ac',
    description:"brand new ac with remote control",
    price:10000,
    views:1000,
    flag: false
  }, 
  {
    id:2,
    title: 'car',
    description:"Car with 150k miles , runs great, recently services.",
    price:250000,
    views:15000,
    flag: true
  },
  {
    id:3,
    title: 'headphone',
    description:"brand new beat on wirelles",
    price:5000,
    views:220,
    flag: true
  },
  {
    id:4,
    title: 'computer',
    description:"250Gb hd , 2GB ram,starter laptop for freshman",
    price:25000,
    views:2000,
    flag: false
  }]

  constructor(public menuCtrl:MenuController,private storage: Storage,private popoverCtrl: PopoverController,public modalCtrl: ModalController,public loadingCtrl: LoadingController,public platform: Platform,
  public navCtrl: NavController,
  public navParams: NavParams,public actionSheetCtrl: ActionSheetController) {
    this.menuCtrl.enable(true);
    this.selectedCity = "Delmas";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

    
browseCategory() {

 let myModal = this.modalCtrl.create(CategoryPage);

    myModal.onDidDismiss(category => {

      let loader = this.loadingCtrl.create({
        content: 'Getting Categories',
      });

      if (category) {
        loader.present().then(() => {

        this.storage.get('category').then((val) => {

            this.category = val.id;
            this.categoryName = val.name;

          });

        });
      }

      setTimeout(() => {
        loader.dismiss();
      }, 1200);

    });

    myModal.present();

  }


  
postListing() {

 let myModal = this.modalCtrl.create(UploadformPage);

   /* myModal.onDidDismiss(category => {

      let loader = this.loadingCtrl.create({
        content: 'Getting Categories',
      });

      if (category) {
        loader.present().then(() => {

        this.storage.get('category').then((val) => {

            this.category = val.id;
            this.categoryName = val.name;

          });

        });
      }

      setTimeout(() => {
        loader.dismiss();
      }, 1200);

    });
*/
    myModal.present();

  }


/*  public post(){
    this.navCtrl.push(UploadformPage);
  }*/


  openLocation(ev) {
    let popover = this.popoverCtrl.create(LocationComponent, {
    });
    popover.present({
      ev: ev
    });
 
    popover.onDidDismiss((popoverData) => {
      this.selectedCity = popoverData;
    })
  }

  public showDetails(id, title ,description,views, flag){
   this.navCtrl.push(ListingDetailsPage,{
        id: id,
        title: title,
        description: description,
        views:views,
        flag:flag
    })
  }

  public favs(id){
     this.favorites.push(id);
     this.favorites = this.favorites.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
     this.storage.set('favorites',this.favorites);
     console.log(this.favorites);
   }

   removeFavorite(id) {
    this.favorites = this.favorites.filter(function(item) {
      return item !== id
    });
    this.storage.set('favorites', this.favorites);
  }

  openFavorites() {

    this.storage.get('favorites').then((val) => {
     console.log(val);
      if (val.length != 0)
        this.favorites
      else
        this.products.length = 0;

    })

  }

}
