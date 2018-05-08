const functions = require('firebase-functions');
const express = require('express');

//var firebase = require("firebase");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

var db = admin.database();
var ref = db.ref("/alertas/");


const app = express();

app.get('/timestamp', (request, response) => {
   
    var d = new Date(Date.now());

    d.setHours(d.getHours() - 3);

    ref.push({

        sensor: "MK0",
        exibido: false,
        tempo: d.toLocaleString()

    });

    response.send('data: ' + d.toLocaleString());
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
