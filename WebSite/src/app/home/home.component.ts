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


  // EM TESTE
  movies: any[] = [];


  constructor(private db: AngularFireDatabase) {

    // this.addAlertaTeste();
    // this.items = this.getAlertas();
    // console.log(this.items);
    // this.items = this.getAlertas();




    // this.onchange();


    this.getAlertas();
    this.onchange();



    // this.items = this.getAlertasFundo('26-05-2018');
    // this.items = this.getAlertas();
    // console.log(this.items);


    /*
    this.items.forEach(teste => {
      console.log(teste);
    });*/
  }

  ngOnInit() {

  }

  getAlertas() {
    this.db.list('/alertas/naoExibido').snapshotChanges().subscribe((res) => {
      this.movies = [];
      res.forEach((pai) => {
        this.db.list('/alertas/naoExibido/' + pai.key).snapshotChanges().subscribe(actions => {
          // console.log('actions');
          if (actions.length > 0) {
            this.playAudio();
          }

          actions.map(a => {
            // console.log(a);
            const data = a.payload.val();
            const id = a.payload.key;
            console.log({ id, ...data });
            // this.movies = [{ id, ...data }];
            this.movies.push({ id, ...data });
          });
        });
      });
    });
  }

  /* getAlertas(): Observable<any[]> {
    return this.db.list('/alertas/naoExibido').snapshotChanges().map(actions => {
      return actions.map(a => {
        console.log(a.key);
        return this.db.list('/alertas/naoExibido/' + a.key).snapshotChanges().map(tipo1 => {
          return tipo1.map(tipo2 => {
            const data = tipo2.payload.val();
            const id = tipo2.payload.key;
            console.log(data);
            return { id, ...data };
          });
        });
      });
    });
  } */



  /*  getAlertas() {
     this.db.list('/alertas/naoExibido').snapshotChanges().map(actions => {
       actions.map(a => {
         console.log(a.key);
          this.db.list('/alertas/naoExibido/' + a.key).snapshotChanges().map(tipo1 => {
            tipo1.map(tipo2 => {
              const data = tipo2.payload.val();
              const id = tipo2.payload.key;
              console.log(data);
              // this.items = { id, ...data };
            });
          });
       });
     });
   } */

  /* getAlertas(): Observable<any[]> {
    return this.db.list('/alertas', ref => ref.orderByChild('exibido').equalTo(false)).snapshotChanges().map(actions => {
      return actions.map(a => {
        // console.log(a);
        const data = a.payload.val();
        const id = a.payload.key;
        return { id, ...data };
      });
    });
  } */


  playAudio() {
    const audio = new Audio();
    audio.src = '../assets/Ping.mp3';
    audio.load();
    audio.play();
  }


  // NOT WORKING
  onchange() {
    this.db.list('/alertas'/* , ref => ref.orderByChild('exibido').equalTo(false) */).snapshotChanges(['child_added'])
      .subscribe(actions => {
        /* actions.forEach(action => {
           // console.log(action.type);
           // console.log(action.key);
           // console.log(action.payload.val());
           this.playAudio();
         });*/
        // console.log(actions);
        if (actions.length > 0) {
          this.playAudio();
        }

      });
  }

  /* addAlertaTeste() {
    this.db.list('/alertas').push({
      dado: 'teste'
    });
  } */

  exibido(any) {
    console.log(any);

    // const itemsRef = this.db.list('/alertas');
    // itemsRef.set(any.id, { exibido: true, sensor: any.sensor, tempo: any.tempo });
  }


}
