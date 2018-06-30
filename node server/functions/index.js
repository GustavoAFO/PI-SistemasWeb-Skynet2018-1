const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

//var firebase = require("firebase");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

var db = admin.database();
//var ref = db.ref("/alertas/");


const app = express();
app.use(cors({ origin: true }));

app.post('/cadastro-node', (request, response) => {
	//FALTA CHECAR SE ELE REALMENTE FOI CADASTRADO
	var counter = 0;
	
	return db.ref("/listagem_home").orderByChild("nodeMCU").equalTo(request.body.nodeMCU).once("value").then(val => {
		
		val.forEach(element => {
			db.ref("/listagem_home/" + element.key).set({ cadastrado_exibido: "true_false"
			, data: element.val().data, exibido: false
			, nodeMCU: element.val().nodeMCU, pasta: element.val().pasta
			, sensor: element.val().sensor, tempo: element.val().tempo });
			counter++;
		});


		return val;
	}).then(res => {
		return response.send("ALTERANDO: " + counter /* + "VAL" + res + ' Teste: ' + JSON.stringify(res) */);
	});

});


app.post('/timestamp', (request, response) => {

	var today = new Date();
	today.setHours(today.getHours() - 3);
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!

	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}

	dd = dd - 2;

	today = dd + '/' + mm + '/' + yyyy;
	todaye = dd + '-' + mm + '-' + yyyy;

	var d = new Date(Date.now());
	d.setHours(d.getHours() - 3);

	var horas = d.getHours();
	var minutos = d.getMinutes();
	var seconds = d.getSeconds();

	var tempo = horas + ':' + minutos + ':' + seconds;
	var ref = db.ref("/alertas/" + dd + '-' + mm + '-' +
		yyyy);


	var confirmacao = db.ref("/nodes").orderByChild("nome_cadastrado").equalTo(request.body.nodeMCU + "_true").once("value").then(snapshot => {
		var confirma;


		if (snapshot.exists()) {
			ref.push({
				nodeMCU: request.body.nodeMCU,
				sensor: request.body.sensor,
				exibido: false,
				tempo: tempo,
				data: today,
				pasta: todaye,
				cadastrado_exibido: "true_false"
			});

			db.ref("/cadastrados").push({
				nodeMCU: request.body.nodeMCU,
				sensor: request.body.sensor,
				exibido: false,
				tempo: tempo,
				data: today,
				pasta: todaye,
				cadastrado_exibido: "true_false"
			});

			db.ref("/listagem_home").push({
				nodeMCU: request.body.nodeMCU,
				sensor: request.body.sensor,
				exibido: false,
				tempo: tempo,
				data: today,
				pasta: todaye,
				cadastrado_exibido: "true_false"
			});

			confirma = "SIM";
		} else {
			db.ref("/nodes/" + request.body.nodeMCU).set({ nome: request.body.nodeMCU, nome_cadastrado: request.body.nodeMCU + "_false", cadastrado: "false", nick: "" });

			ref.push({
				nodeMCU: request.body.nodeMCU,
				sensor: request.body.sensor,
				exibido: false,
				tempo: tempo,
				data: today,
				pasta: todaye,
				cadastrado_exibido: "false_false"
			});

			db.ref("/nao_cadastrados").push({
				nodeMCU: request.body.nodeMCU,
				sensor: request.body.sensor,
				exibido: false,
				tempo: tempo,
				data: today,
				pasta: todaye,
				cadastrado_exibido: "false_false"
			});

			db.ref("/listagem_home").push({
				nodeMCU: request.body.nodeMCU,
				sensor: request.body.sensor,
				exibido: false,
				tempo: tempo,
				data: today,
				pasta: todaye,
				cadastrado_exibido: "false_false"
			});

			confirma = "NAO";
		}
		return confirma;

	}).then(res => {
		return response.send('data: ' + today + ' hora: ' + tempo + ' Teste: ' + JSON.stringify(request.body) + " Confirma: " + res);
	});/* .finnaly(res => {
		response.send('data: ' + today + ' hora: ' + tempo + ' Teste: ' + JSON.stringify(request.body) + " Confirma: ");
	}); */
	//var confirma = "teste";




	//response.send('data: ' + today + ' hora: ' + tempo + ' Teste: ' + JSON.stringify(request.body) + " Confirma: " + confirma);
});


app.get('/timestamp', (request, response) => {

	var today = new Date();
	today.setHours(today.getHours() - 3);
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!

	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}

	today = dd + '/' + mm + '/' + yyyy;
	todaye = dd + '-' + mm + '-' + yyyy;

	var d = new Date(Date.now());
	d.setHours(d.getHours() - 3);

	var horas = d.getHours();
	var minutos = d.getMinutes();
	var seconds = d.getSeconds();

	var tempo = horas + ':' + minutos + ':' + seconds;

	var ref = db.ref("/alertas/" + dd + '-' + mm + '-' + yyyy);

	ref.push({

		nodeMCU: "teste",
		sensor: "MK0",
		exibido: false,
		tempo: tempo,
		data: today,
		pasta: todaye

	});

	db.ref("/cadastrados").push({
		nodeMCU: request.body.nodeMCU,
		sensor: request.body.sensor,
		exibido: false,
		tempo: tempo,
		data: today,
		pasta: todaye
	});

	response.send('data: ' + today + ' hora: ' + tempo + "TIPO: GET");
});


app.post('/', (req, res) => res.send("POST"));


/*
	app.get('/insert', (request, response) => {
    ref.set({
	alanisawesome: {
	date_of_birth: "June 23, 1912",
	full_name: "Alan Turing"
	}
    });
	
    response.send('sent');
});*/

/* function handleGET(req, res) {
	// Do something with the GET request
	res.status(200).send('Hello World!');
}


exports.helloHttp = (req, res) => {
	switch (req.method) {
		case 'GET':
			handleGET(req, res);
			break;
		case 'POST':
			res.status(500).send({ error: 'USING POST' });
			break;
		default:
			res.status(500).send({ error: 'Something blew up!' });
			break;
	}
}; */

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
