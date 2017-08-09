import { Component,ViewChild, NgZone } from '@angular/core';
import * as io from 'socket.io-client';
import { IonicPage, NavController, NavParams,Content } from 'ionic-angular';

/**
 * Generated class for the ChatsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  @ViewChild(Content) content:Content;
  messages:any = [];
  socketHost:string ="http://localhost:3000";
  socket:any;
  chat:any;
  username:string;
  zone:any;
  title:any;
  price:any

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.username = navParams.get('username');
    this.title = navParams.get('title');
    this.price = navParams.get('price');
    this.socket = io.connect(this.socketHost);
    this.zone = new NgZone({enableLongStackTrace: false});
    this.socket.on("chat message", (msg) =>{
      this.zone.run(() =>{
          this.messages.push(msg);
          this.content.scrollToBottom();
      });
    });  
  }

  chatSend(v){
    let data ={
      message: v.chatText,
      username: this.username
    }
    this.socket.emit('new message',data);
    this.chat ='';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatsPage');
  }

}
