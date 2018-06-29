const functions = require('firebase-functions');
const express = require('express');
//const cors = require('cors');

//var firebase = require("firebase");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

var db = admin.database();
//var ref = db.ref("/alertas/");


const app = express();
//app.use(cors({ origin: true }));

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

	dd = dd-1;

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


	var confirmacao = db.ref("/Nodes").orderByChild("nodeMCU").equalTo(request.body.nodeMCU).once("value").then(snapshot => {
		var confirma;
		if (snapshot.exists()) {
			ref.push({
				nodeMCU: request.body.nodeMCU,
				sensor: request.body.sensor,
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

			confirma = "SIM";
		} else {

			db.ref("/nao_cadastrados").push({
				nodeMCU: request.body.nodeMCU,
				sensor: request.body.sensor,
				exibido: false,
				tempo: tempo,
				data: today,
				pasta: todaye
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
		data: today

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
