import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadformPage } from './uploadform';

@NgModule({
  declarations: [
    UploadformPage,
  ],
  imports: [
    IonicPageModule.forChild(UploadformPage),
  ],
  exports: [
    UploadformPage
  ]
})
export class UploadformPageModule {}

