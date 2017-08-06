import { ViewChild,Component } from '@angular/core';
import { NavController,Content,NavParams,Events,
LoadingController,ActionSheetController,MenuController,
Platform,ModalController,PopoverController  } from 'ionic-angular';
import { CategoryPage } from '../category/category';
import { UploadformPage } from '../uploadform/uploadform';
import { Storage } from '@ionic/storage';
import { LocationComponent } from '../../components/location/location';
import { ListingDetailsPage } from '../listing-details/listing-details';
import { BackandService } from '@backand/angular2-sdk';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  @ViewChild(Content) content: Content;

  public listings:any[] = [];
  category:any;
  deep:any;
  categoryName:string ="Electronic";
  favorites = [];
  selectedCity:string="Delmas";
  searchQuery: string;

  constructor(private backand:BackandService,public menuCtrl:MenuController,private storage: Storage,private popoverCtrl: PopoverController,public modalCtrl: ModalController,public loadingCtrl: LoadingController,public platform: Platform,
  public navCtrl: NavController,
  public navParams: NavParams,public actionSheetCtrl: ActionSheetController) {
    this.menuCtrl.enable(true);
    this.selectedCity = "Delmas";
    this.categoryName;
   
    this.searchQuery = '';
    let that = this;
    this.backand.on("items_updated",
      (res: any) => {
        let a = res as any[];
        let newItem = {};
        a.forEach((kv)=> newItem[kv.Key] = kv.Value);
        that.listings.unshift(newItem);
      }
    );

  let loader = this.loadingCtrl.create({
       spinner: 'dots'
  })

  loader.present().then(() => {

      this.storage.get('category').then((val) => {
        if (val) {
          this.category = val.id;
          this.categoryName = val.name;
        } else {
          this.category = 1;
          this.categoryName = 'Electronic';
          this.storage.set('category', this.category);
        }

        this.backand.object.getList('Listings')
          .then((res: any) => {
            this.listings = res.data;
          },
          (err: any) => {
            alert(err.data);
          });

      });

    this.storage.get('favorites').then((val) =>{
      if(!val)
        this.storage.set('favorites',this.favorites);
      else
        this.favorites = val;
    })
      
    setTimeout(() => {
      loader.dismiss();
    }, 2000);
  }); 

}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

      
 browseCategory() {

    let myModal = this.modalCtrl.create(CategoryPage);

    myModal.onDidDismiss(genre => {

      let loader = this.loadingCtrl.create({
       spinner: 'dots'
      });

      if (genre) {
        loader.present().then(() => {

          this.storage.get('category').then((val) => {

            this.category = val.id;
            this.categoryName = val.name;

            this.backand.query.post('getRelatedListings', {
                "category_id": this.category
              })
            .then((res: any) => {
              this.listings = res.data;
            },
            (err: any) => {
              alert(err.data);
            });

          });

        });
      }

      setTimeout(() => {
        loader.dismiss();
      }, 1200);

    });

    myModal.present();

  }

public getListings() {
   this.backand.object.getList('Listings')
    .then((res: any) => {
      this.listings = res.data;
    },
    (err: any) => {
      alert(err.data);
    });
 }

 public getCategory(category_id){
    
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

  public getFavorites(favs){
     let favorites = favs
     favorites = favorites.join();
   /*   let params = {
      filter: [
        this.backand.helpers.filter.create('id', this.backand.helpers.filter.operators.text.equals, favorites),
      ],
    }*/
    this.backand.query.post("getfavs", {
      "params": favorites
    })
    .then(res => {
      this.listings = res.data;
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    });   
   
  }

  openFavorites() {
    this.storage.get('favorites').then((val) => {
     console.log(val);
      if (val.length != 0)
       this.getFavorites(val);
       /* this.backand.query.get('getfavs',val.join())
        .then(res => {
          this.listings = res.data;
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });*/
      else
        this.listings.length = 0;

    })

  }

  public filterItems() {
    // set q to the value of the searchbar
    var q = this.searchQuery;

    // if the value is an empty string don't filter the items
    if (!q || q.trim() == '') {
      return;
    }
    else{
        q = q.trim();
    }

    let params = {
      filter: [
        this.backand.helpers.filter.create('title', this.backand.helpers.filter.operators.text.contains, q),
      ],
    }

    this.backand.object.getList('Listings', params)
    .then((res: any) => {
      this.listings = res.data;
    },
    (err: any) => {
      alert(err.data);
    });
  }

}
