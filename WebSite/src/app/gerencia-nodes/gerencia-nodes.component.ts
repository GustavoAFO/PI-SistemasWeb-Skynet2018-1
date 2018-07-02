import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { QueryBindingType } from '@angular/core/src/view';
import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-gerencia-nodes',
  templateUrl: './gerencia-nodes.component.html',
  styleUrls: ['./gerencia-nodes.component.css']
})
export class GerenciaNodesComponent implements OnInit {
  //items: any[] = [];
  //itemsTeste: any[] = [];

  itemsObservable: Observable<any[]>;
  itemsCadastradosObservable: Observable<any[]>;
  /* nodesObservable: Observable<any[]>; */

  headers: Headers;
  options: RequestOptions;


  constructor(private db: AngularFireDatabase, public http: Http) {
    //console.log("teste Gerencia de nodes");
    this.itemsObservable = this.getNodesNaoCadastrados();
    this.itemsCadastradosObservable = this.getNodesCadastrados();

    this.headers = new Headers({
      'Content-Type': 'application/json',
    });
    this.options = new RequestOptions({ headers: this.headers });




    //this.itemsObservable = this.getAlertasTeste();

    /* this.nodesObservable = this.getNodes(); */


    /*  this.nodesObservable.subscribe(sub => {
       this.itemsTeste = [];
       console.log(sub);
       sub.forEach(item => {
         this.itemsTeste.push(item);
         //var teste = this.items.find(x => x.nodeMCU === item.nodeMCU);
         //console.log(teste);
 
         this.itemsObservable.lift;
 
       });
     }); */


    /* this.itemsObservable.subscribe(sub => {

      this.items = [];
      this.itemsTeste = [];
      console.log(this.itemsTeste);
      sub.forEach(primeiro => {
        primeiro.forEach(segundo => {
          //console.log(segundo);

          segundo.forEach(terceiro => {

          




            //PRIMEIRA FORMA
            var counter = 0;
            this.db.list('/Nodes', ref => ref.orderByChild('nodeMCU').equalTo(terceiro.nodeMCU)).snapshotChanges().forEach(teste => {

              if (counter == 0 && teste.length == 0) {
                //ADICIONA APENAS OS QUE NAO ESTAO CADASTRADOS
                this.items.push(terceiro);


                
                //FILTRA OS NODES
                const curr = this.items.map(data => {
                  const nodeMCU = data.nodeMCU;
                  const id = data.id;
                  return nodeMCU;
                });
                //COLOCA OS NODES FILTRADOS EM UM NOVO ARRAY
                this.itemsTeste = curr.filter((x, i, a) => x && a.indexOf(x) === i);


                //console.log(this.itemsTeste);
              }

              counter++;
            });


          })
        });
      }); 


    });*/
  }

  ngOnInit() {

  }

  getNodesNaoCadastrados(): Observable<any[]> {
    return this.db.list('/nodes', ref => ref.orderByChild('cadastrado').equalTo("false")).snapshotChanges().map(actions => {
      return actions.map(a => {


        // console.log(a);
        const data = a.payload.val();
        const id = a.payload.key;
        return { id, ...data };
      });
    });
  }

  getNodesCadastrados(): Observable<any[]> {
    return this.db.list('/nodes', ref => ref.orderByChild('cadastrado').equalTo("true")).snapshotChanges().map(actions => {
      return actions.map(a => {


        // console.log(a);
        const data = a.payload.val();
        const id = a.payload.key;
        return { id, ...data };
      });
    });
  }



  /* getAlertasTeste(): Observable<any[]> {
    return this.db.list('/alertas').snapshotChanges().map(primeiro => {
      //console.log(primeiro);
      return primeiro.map(segundo => {
        //console.log(segundo);
        return this.db.list('/alertas/' + segundo.key,
          ref => ref.orderByChild('exibido').equalTo(false)).snapshotChanges().map(terceiro => {
            return terceiro.map(quarto => {

              const data = quarto.payload.val();
              const id = quarto.payload.key;


              return { id, ...data };

            });
          });
      });
    });
  } */


  //TESTE, NAO FUNCIONA
  /*  getNodes(): Observable<any[]> {
     return this.db.list('/Nodes', ref => ref.orderByChild('nodeMCU')).snapshotChanges().map(nodes => {
       return nodes.map(node => {
         const data = node.payload.val();
         const id = node.payload.key;
         return { id, ...data };
       });
     });
   } */


  cadastrar(node) {
    console.log(node);

    /* this.db.database.ref("/Nodes").push({
      "nodeMCU": node
    }); */

    this.db.list('/nodes').set(node.id, { cadastrado: "true", nick: "", nome: node.nome, nome_cadastrado: node.nome + "_true" });

    this.call(node);

  }


  call(node) {
    return this.http.post("https://us-central1-sensoresskynet20181.cloudfunctions.net/app/cadastro-node/", { "nodeMCU": node.nome }, this.options).subscribe(sub => {
      console.log(sub);
    });
  }
}
