import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage,NavController, NavParams,ViewController } from 'ionic-angular';
import { BackandService } from '@backand/angular2-sdk';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
 /* categories:Array<any>;*/
  categories:any[] = []
  categoryName;

  currentCategory: any;
  constructor(private backand:BackandService,public viewCtrl:ViewController,private storage: Storage,public navCtrl: NavController, public navParams: NavParams) {
  this.getCategories();
  }

  ionViewDidEnter() {
    this.storage.get('category').then((val) => {
      if (val)
        this.currentCategory = val.id;
      else
        this.currentCategory = 1;
    });
  }

  CategorySelected(category) {
    this.storage.set('category', category);
    this.viewCtrl.dismiss(category);
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
 

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

}

