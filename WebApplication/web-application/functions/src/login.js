// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

const bodyParser = require('body-parser');
const express = require('express');
const joi = require('@hapi/joi');
const cors = require('cors');
const app = express();

admin.initializeApp();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = login;