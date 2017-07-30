import { Component } from '@angular/core';
import {ViewController} from 'ionic-angular';

/**
 * Generated class for the LocationComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'location',
  templateUrl: 'location.html'
})
export class LocationComponent {
  catList = [{city: 'Delmas'}, {city: 'Petion-Ville'}, {city: 'Carrefour'},{city: 'fontamara'}]
  selectedCity: string;

  constructor(private viewCtrl: ViewController) {
    
    console.log('Hello LocationComponent Component');
    this.selectedCity = 'Select City';
  }

  setSelectedCity(selectedItem) {
    this.selectedCity = selectedItem;
    this.viewCtrl.dismiss(this.selectedCity);
  }

}