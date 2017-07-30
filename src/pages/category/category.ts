import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage,NavController, NavParams,ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
 /* categories:Array<any>;*/
  categories = [
  {
    id:1,
    name: 'New listed'}, 
  {
    id:2,
    name: 'Autos'},
  {
    id:3,
    name: 'Pour Hommes'},
  {
    id:4,
    name: 'Pour femmes'},
  {
    id:5,
    name: 'jouets'},
  {
    id:6,
    name: 'fournitures'},
  {
    id:7,
    name: 'Electronic'}]

  currentCategory: any;
  constructor(public viewCtrl:ViewController,private storage: Storage,public navCtrl: NavController, public navParams: NavParams) {
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
 

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

}

