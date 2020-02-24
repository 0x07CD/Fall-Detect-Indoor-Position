// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

const createUser = require('./src/createUser');

exports.createUser = functions.https.onRequest(createUser);