const functions = require('firebase-functions');
const express = require('express');

//var firebase = require("firebase");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

var db = admin.database();
//var ref = db.ref("/alertas/");


const app = express();

app.get('/timestamp', (request, response) => {


	var today = new Date();
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

	var ref = db.ref("/alertas/naoExibido/" + dd + '-' + mm + '-' + yyyy);

	ref.push({

		sensor: "MK0",
		exibido: false,
		tempo: tempo,
		data: today

	});

	response.send('data: ' + today + ' hora: ' + tempo);
});


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

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
