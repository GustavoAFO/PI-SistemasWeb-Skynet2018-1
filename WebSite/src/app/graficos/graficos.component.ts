import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { distinctUntilChanged } from 'rxjs-compat/operator/distinctUntilChanged';
import { distinct } from 'rxjs-compat/operator/distinct';


@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit, AfterViewInit {
  items: Observable<any[]>;
  dias: any[];

  constructor(private db: AngularFireDatabase) {

    this.items = this.getAlertas();

    this.items.forEach((teste) => {
      console.log(teste);
      teste.forEach((segundo) => {
        console.log(segundo);
      });

    });

    /*
    {
      'dia 1':{
        'dasdsa' : 'SDadasd',
        'dsadasd' : 'dsadsad'
      },
      'dia 2':{
        'dasdsa' : 'SDadasd',
        'dsadasd' : 'dsadsad'
      }

    }*/



  }


  canvas: any;
  ctx: any;

  ngAfterViewInit() {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');

    const myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: ['New', 'New', 'On Hold'],
        datasets: [{
          label: '# of Votes',
          data: [1, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false
      }
    });
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

}
