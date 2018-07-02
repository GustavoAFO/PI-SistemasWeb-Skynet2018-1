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
  dataPesquisa = { inicial: "", final: "" };

  counter = 0;

  canvas: any;
  ctx: any;

  chart: Chart;
  constructor(private db: AngularFireDatabase) {
    //this.getAlertas();
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

  atualizar() {
    //console.log("DATA:");
    //console.log(this.dataPesquisa.inicial);
    //console.log(this.dataPesquisa.final);
    //var dateInicial = this.dataPesquisa.inicial.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3/$2/$1");
    var teste = this.dataPesquisa.inicial.split("-");
    var dateInicial = teste[0] + "-" + teste[1] + "-" + teste[2];

    teste = this.dataPesquisa.final.split("-");
    var dateFinal = teste[0] + "-" + teste[1] + "-" + teste[2];

    console.log(dateInicial);
    console.log(dateFinal);

    this.getAlertas();
  }

  transformDateSlashTela(data) {
    var teste = data.split("-");
    var datett = teste[0] + "/" + teste[1] + "/" + teste[2];
    return datett;
  }

  transformDateSlash(data) {
    var teste = data.split("-");
    var datett = teste[2] + "/" + teste[1] + "/" + teste[0];
    return datett;
  }

  transformDateDatabase(data) {
    var teste = data.split("/");
    var datett = teste[2] + "/" + teste[1] + "/" + teste[0];
    return datett;
  }

  getAlertas() {


    this.items = [];
    this.dias = [];
    this.data = [];

    this.db.list('/listagem_home').snapshotChanges().subscribe(actions => {
      actions.map(a => {

        //console.log(a.type);


        // console.log(a);
        const data = a.payload.val();
        const id = a.payload.key;
        // { id, ...data };

        var inicial = new Date(this.transformDateSlashTela(this.dataPesquisa.inicial));
        var final = new Date(this.transformDateSlashTela(this.dataPesquisa.final));
        //var datett = this.transformDateSlash(data.data);

        //var attdatt = new Date(datett);
        var attdatt = new Date(this.transformDateDatabase(data.data));
        /* console.log(inicial);
        console.log(final);
        console.log(attdatt); */

        if (((attdatt <= final) && (attdatt >= inicial)) || (this.dataPesquisa.inicial == "" && this.dataPesquisa.final == "")) {
          var test = this.dias.findIndex(x => x == data.data);
          //console.log(test);

          if (test < 0) {
            this.dias.push(data.data);
            //console.log(this.dias);
            var test2 = this.dias.findIndex(x => x == data.data);
            this.data[test2] = 1;
          }
          else {

            this.data[test]++;
          }
        }


      });

      //console.log(this.data);
      this.updateChart();
    });
  }

  updateChart() {
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

  }

  /* getAlertas() {

    this.items = [];
    this.dias = [];
    this.data = [];


    this.db.list('/alertas').snapshotChanges().subscribe((res) => {

      res.forEach((tipo) => {
        //console.log(tipo);
        if (tipo.type === 'child_changed' || tipo.type === 'child_added') {
          this.items = [];
          this.dias = [];
          this.data = [];

        }
      });
    

      res.forEach((pai) => {

        var inicial = new Date(this.transformDateSlashTela(this.dataPesquisa.inicial));
        var final = new Date(this.transformDateSlashTela(this.dataPesquisa.final));
        var datett = this.transformDateSlash(pai.key);

        var attdatt = new Date(datett);
        


        if (((attdatt <= final) && (attdatt >= inicial)) || (this.dataPesquisa.inicial == "" && this.dataPesquisa.final == "")) {
          //console.log("ADICIONOU:");
          //console.log(pai.key);

          if (!this.dias[pai.key]) {
            this.dias.push(pai.key);
            //console.log(this.dias);
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
        }
        else {
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
        }


      });
    });
  } */

}
