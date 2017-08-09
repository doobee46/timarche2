import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChatsPage } from '../chats/chats';

@Component({
  selector: 'page-listing-details',
  templateUrl: 'listing-details.html',
})
export class ListingDetailsPage {
  public id;
  public title;
  public description;
  public views;
  public flag;
  public username;
  public price;

  images = ['car.jpg', 'computer.jpg', 'ac.jpg', 'headphone.jpg'];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = navParams.get('id');
    this.title = navParams.get('title');
    this.description = navParams.get('description');
    this.views = navParams.get('views');
    this.flag=navParams.get('flag');
    this.price=navParams.get('price');
    this.username =navParams.get('username');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListingDetailsPage');
   
  }

  openChat(){
    this.navCtrl.push(ChatsPage,{
      username : this.username,
      title: this.title,
      price: this.price
    });
  }

}
