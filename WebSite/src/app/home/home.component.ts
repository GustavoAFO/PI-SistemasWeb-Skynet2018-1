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
  // items: Observable<any[]>;


  // EM TESTE
  items: any[] = [];


  constructor(private db: AngularFireDatabase) {

    this.getAlertas();
    this.onchange();

    /* this.items.forEach(teste => {
      console.log(teste);
    }); */
  }

  ngOnInit() {

  }



  // TESTAR COM $groupid ('/alertas/' + $groupid) E TESTAR DUPLICANDO DATA
  // DUPLICANDO FUNCIONARÁ PROVAVELMENTE, CADASTRAR ALERTAS EM /alertas e EM PASTA COM DATA,
  // AO EXIBIR DELETAR O QUE ESTA DENTRO DO ALERTAS E DEIXAR OS DAS PASTAS











  getAlertas() {
    this.db.list('/alertas').snapshotChanges().subscribe((res) => {
      this.items = [];

      res.forEach((pai) => {
        // console.log(pai.key);
        this.db.list('/alertas/' + pai.key, ref => ref.orderByChild('exibido').equalTo(false)).snapshotChanges().subscribe(actions => {
          // console.log('pai.key');
          // console.log(actions);
          actions.map(a => {
            // console.log(a);
            const data = a.payload.val();
            const id = a.payload.key;
            // console.log({ id, ...data });
            this.items.push({ id, ...data });
          });
        });
      });
    });
  }


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

  onchange() {
    this.db.list('/alertas').snapshotChanges()
      .subscribe(actions => {
        actions.forEach((filho) => {
          this.db.list('/alertas/' + filho.key, ref => ref.orderByChild('exibido').equalTo(false)).snapshotChanges(['child_added'])
            .subscribe((alertas) => {
              // console.log(alertas);

              alertas.forEach(alerta => {
                /* console.log(alerta.type);
                console.log(alerta.key);
                console.log(alerta.payload.val()); */
                if (alerta.type === 'child_added') {
                  // console.log('apitou');
                  this.playAudio();
                }
              });


              /* if (alertas.length > 0) {
                this.playAudio();
              } */
            });
        });
      });
  }

  // NOT WORKING
  /* onchange() {
    this.db.list('/alertas').snapshotChanges(['child_added'])
      .subscribe(actions => {
        // console.log(actions);
        if (actions.length > 0) {
          this.playAudio();
        }

      });
  } */

  /* addAlertaTeste() {
    this.db.list('/alertas').push({
      dado: 'teste'
    });
  } */

  exibido(any) {
    // console.log(any);
    const re = /\//gi;
    const novaData = any.data.replace(re, '-');
    // novaData = novaData.replace('/', '-');

    // console.log(novaData);
    const itemsRef = this.db.list('/alertas/' + novaData);
    itemsRef.set(any.id, { exibido: true, sensor: any.sensor, tempo: any.tempo, data: any.data });
  }


}
