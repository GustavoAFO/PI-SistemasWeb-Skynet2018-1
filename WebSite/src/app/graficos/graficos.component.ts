import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';


@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit, AfterViewInit {
  items: any[];
  dias: any[] = []; // LABELS
  data: any[] = []; // DATA

  counter = 0;

  canvas: any;
  ctx: any;

  chart: Chart;
  constructor(private db: AngularFireDatabase) {
  }


  ngAfterViewInit() {

    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');

    const myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.dias/* ['New', 'New', 'On Hold'] */,
        datasets: [{
          label: 'ALERTAS GERADOS ATÉ O MOMENTO',
          data: this.data/* [1, 2, 3] */,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: false
      }
    });

    this.chart = myChart;
    this.getAlertas();
  }

  ngOnInit() {
  }

  getAlertas() {
    this.db.list('/alertas').snapshotChanges().subscribe((res) => {

      res.forEach((tipo) => {
        // console.log(tipo);
        if (tipo.type === 'child_changed') {
          this.items = [];
          this.dias = [];
          this.data = [];

        }
      });
      /* this.items = [];
      this.dias = [];
      this.data = []; */

      res.forEach((pai) => {

        if (!this.dias[pai.key]) {
          this.dias.push(pai.key);
          console.log(this.dias);
        }
        // this.dias.push(pai.key);

        this.db.list('/alertas/' + pai.key).snapshotChanges().subscribe(actions => {

          this.counter = 0;

          actions.map(a => {

            this.counter++;
            // console.log('aumentou');

            const data = a.payload.val();
            const id = a.payload.key;



          });


          this.data.push(this.counter);
          console.log(this.data);

          // console.log(this.counter);

          this.chart.data = {
            labels: this.dias,
            datasets: [{
              label: 'ALERTAS GERADOS ATÉ O MOMENTO',
              data: this.data,
              backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 10,
              borderColor: 'rgba(255, 99, 132, 1)'
            }]
          };

          this.chart.update();

        });


      });
    });
  }

}
