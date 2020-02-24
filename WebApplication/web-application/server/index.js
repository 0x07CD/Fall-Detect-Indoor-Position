'use strict'

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

const signIn = require('./src/signIn');
const createUser = require('./src/createUser');

exports.signIn = functions.https.onRequest(signIn);
exports.createUser = functions.https.onRequest(createUser);