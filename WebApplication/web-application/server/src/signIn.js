'use strict'

const admin = require('./firebaseConfig');

const bodyParser = require('body-parser');
const express = require('express');
const joi = require('@hapi/joi');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// regular expression
const password_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}$/;

app.post("/", async (req, res) => {
    const email_value = req.body.email;
    const password_value = req.body.password;

    // validate email and password
    // create schema
    const schema = joi.object({
        email: joi.string().email({
            minDomainSegments: 2,
            tlds: {
                allow: ["com", "net"]
            }
        }).required(),
        password: joi.string().pattern(password_pattern).required()
    });

    // validate
    const { error, value } = schema.validate({
        email: email_value,
        password: password_value
    });

    // if data invalid
    if (error !== undefined) {
        res.json({
            error: error
        });
        return null;
    }

    /*
    await firebase.auth().signInWithEmailAndPassword(value.email, value.password).then(async (user) => {
        // get refresh firebase token
        await user.getIdToken(true).then((token) => {
            res.json({
                token: token
            });
            return null;
        }).catch((error) => {
            res.json({
                error: error
            });
        });
        return null;
    }).catch((error) => {
        res.json({
            error: error
        });
    });
    */
   return null;

});

module.exports = app;