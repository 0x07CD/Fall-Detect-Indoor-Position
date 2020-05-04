'use strict'

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const admin = require('./firebase/firebaseConfig');

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ["http://localhost:3000", "https://ce62-29.firebaseapp.com"]
const corsOption = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    }
}
app.use(cors(corsOption));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./router/users')(app);
require('./router/signIn')(app);
require('./router/locations')(app);
require('./router/monitoring')(app);
require('./router/createUser')(app);

app.get("/test", (req, res) => {
    res.send("OK");
});

exports.updatePosition = functions.firestore.document("monitoring/{locationName}").onWrite((change, context) => {
    try {
        let dataUpdated = change.after.data();
        let keys = Object.keys(dataUpdated);

        // To ensure that reference node are changed more than or equal to 3
        
    } catch (e) {
        console.log(e);
    }
});

exports.api = functions.https.onRequest(app);