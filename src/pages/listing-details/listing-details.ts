import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ListingDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

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

  images = ['car.jpg', 'computer.jpg', 'ac.jpg', 'headphone.jpg'];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = navParams.get('id');
    this.title = navParams.get('title');
    this.description = navParams.get('description');
    this.views = navParams.get('views');
    this.flag=navParams.get('flag');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListingDetailsPage');
   
  }

}
