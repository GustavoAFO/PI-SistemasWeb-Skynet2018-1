import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-grafico-sensores',
  templateUrl: './grafico-sensores.component.html',
  styleUrls: ['./grafico-sensores.component.css']
})
export class GraficoSensoresComponent implements OnInit, AfterViewInit {

  items: any[];
  dias: any[] = []; // LABELS
  data: any[] = []; // DATA
  dataPesquisa = { inicial: "", final: "" };

  counter = 0;

  canvas: any;
  ctx: any;

  chart: Chart;

  nodes: Observable<any[]>;
  selectedNode: any;


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

    this.nodes = this.getNodes();
  }

  ngOnInit() {
  }

  atualizar() {
    var teste = this.dataPesquisa.inicial.split("-");
    var dateInicial = teste[0] + "-" + teste[1] + "-" + teste[2];

    teste = this.dataPesquisa.final.split("-");
    var dateFinal = teste[0] + "-" + teste[1] + "-" + teste[2];

    console.log(dateInicial);
    console.log(dateFinal);

    this.getAlertas();

    console.log(this.selectedNode);
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


  getNodes(): Observable<any[]> {
    return this.db.list('/nodes'/* , ref => ref.orderByChild('exibido').equalTo(false) */).snapshotChanges().map(actions => {
      return actions.map(a => {
        // console.log(a);
        const data = a.payload.val();
        const id = a.payload.key;
        return { id, ...data };
      });
    });
  }

  getAlertas() {

    this.items = [];
    this.dias = [];
    this.data = [];

    var slcNodeMCU = "";
    var secondCounter = 0;

    this.db.list('/alertas').snapshotChanges().subscribe((res) => {

      res.forEach((tipo) => {
        //console.log(tipo);
        if (tipo.type === 'child_changed' || tipo.type === 'child_added') {
          this.items = [];
          this.dias = [];
          this.data = [];

        }
      });
      /* this.items = [];
      this.dias = [];
      this.data = []; */

      res.forEach((pai) => {

        var inicial = new Date(this.transformDateSlashTela(this.dataPesquisa.inicial));
        var final = new Date(this.transformDateSlashTela(this.dataPesquisa.final));
        var datett = this.transformDateSlash(pai.key);

        var attdatt = new Date(datett);



        if (((attdatt <= final) && (attdatt >= inicial)) || (this.dataPesquisa.inicial == "" && this.dataPesquisa.final == "")) {

          //console.log(this.selectedNode);
          if (this.selectedNode == undefined || this.selectedNode == "" || this.selectedNode == "TODOS") {
            this.db.list('/alertas/' + pai.key, ref => ref.orderByChild('nodeMCU')).snapshotChanges().subscribe(actions => {

              actions.map(a => {


                // console.log('aumentou');

                const data = a.payload.val();
                const id = a.payload.key;



                if (data.nodeMCU != slcNodeMCU) {

                  if (!this.dias[data.nodeMCU]) {
                    this.dias.push(data.nodeMCU);
                    //console.log(this.dias);
                  }

                  if (slcNodeMCU != "") {
                    //this.data.push(this.counter);
                    secondCounter++;
                  }

                  slcNodeMCU = data.nodeMCU;


                  this.counter = 0;
                }

                this.counter++;
                //this.data[data.nodeMCU] = this.counter;
                this.data[secondCounter] = this.counter;

                /* console.log(this.data.map(item => {
  
                })); */

              });




              console.log(this.data);




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
          } else {

            this.db.list('/alertas/' + pai.key, ref => ref.orderByChild('nodeMCU').equalTo(this.selectedNode)).snapshotChanges().subscribe(actions => {

              actions.map(a => {


                // console.log('aumentou');

                const data = a.payload.val();
                const id = a.payload.key;



                if (data.nodeMCU != slcNodeMCU) {

                  if (!this.dias[data.nodeMCU]) {
                    this.dias.push(data.nodeMCU);
                    //console.log(this.dias);
                  }

                  if (slcNodeMCU != "") {
                    //this.data.push(this.counter);
                    secondCounter++;
                  }

                  slcNodeMCU = data.nodeMCU;


                  this.counter = 0;
                }

                this.counter++;
                //this.data[data.nodeMCU] = this.counter;
                this.data[secondCounter] = this.counter;

                /* console.log(this.data.map(item => {
  
                })); */

              });




              console.log(this.data);




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


        } else {
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
  }




}
