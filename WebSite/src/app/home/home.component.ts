import { Component, OnInit } from '@angular/core';
// import { FirebaseConfig } from './../environments/firebase.config';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { Observable } from 'rxjs';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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

  ngOnInit() {

  }

  getAlertas(): Observable<any[]> {
    return this.db.list('/alertas', ref => ref.orderByChild('exibido').equalTo(false)).snapshotChanges().map(actions => {
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
    this.db.list('/alertas', ref => ref.orderByChild('exibido').equalTo(false)).snapshotChanges(['child_added'])
      .subscribe(actions => {
        /* actions.forEach(action => {
           // console.log(action.type);
           // console.log(action.key);
           // console.log(action.payload.val());
           this.playAudio();
         });*/
        console.log(actions);
        if (actions.length > 0) {
          this.playAudio();
        }

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

  exibido(any) {
    console.log(any);

    const itemsRef = this.db.list('/alertas');
    itemsRef.set(any.id, { exibido: true, sensor: any.sensor, tempo: any.tempo });
  }


}
