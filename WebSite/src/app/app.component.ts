import { Component } from '@angular/core';
import { FirebaseConfig } from './../environments/firebase.config';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  items: Observable<any[]>;

  constructor(private db: AngularFireDatabase) {

    // this.addAlertaTeste();
    this.items = this.getAlertas();
    // console.log(this.items);

    this.items.forEach(teste => {
      console.log(teste);
    });

    this.onchange();
  }

  getAlertas(): Observable<any[]> {
    return this.db.list('/alertas').snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.val();
        const id = a.payload.key;
        return { id, ...data };
      });
    });
  }

  playAudio() {
    const audio = new Audio();
    audio.src = '../assets/Ping.mp3';
    audio.load();
    audio.play();
  }

  onchange() {
    this.db.list('/alertas').snapshotChanges(['child_added'])
      .subscribe(actions => {
        actions.forEach(action => {
          // console.log(action.type);
          // console.log(action.key);
          // console.log(action.payload.val());
          this.playAudio();
        });
      });
  }

  /*
  getAlertas(): Observable<any[]> {
    return this.db.list('/alertas').snapshotChanges();
  }*/

  addAlertaTeste() {
    this.db.list('/alertas').push({
      dado: 'teste'
    });
  }



}


