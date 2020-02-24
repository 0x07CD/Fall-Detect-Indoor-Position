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

// regular expression
const username_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}$/;
const password_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}$/;

app.post("/", async (req, res, next) => {
    const username_value = req.body.username
    const email_value = req.body.email;
    const password_value = req.body.password;

    const schema = joi.object({
        username: joi.string().pattern(username_pattern).required(),
        email: joi.string().email({
            minDomainSegments: 2,
            tlds: {
                allow: ['com', 'net']
            }
        }).required(),
        password: joi.string().pattern(password_pattern).required()
    });

    const { error, value } = schema.validate({
        username: username_value,
        email: email_value,
        password: password_value
    });

    var response_massage = {
        error: false,
        massage: ""
    }

    // if data valid
    if (error === undefined) {
        await admin.auth().getUser(value.username).then((record) => {
            response_massage = {
                error: true,
                massage: "username already exists"
            };
            return null;

        }).catch((error) => {
            response_massage = {
                error: false,
                massage: error
            }
        });

        await admin.auth().getUser(value.username).then((record) => {
            response_massage = {
                error: true,
                massage: "email already exists"
            };
            return null;

        }).catch((error) => {
            response_massage = {
                error: false,
                massage: error
            }
        });

        // if username/email not exists and getUser() successful
        if (!response_massage.error) {
            // create user account with admin sdk
            await admin.auth().createUser({
                uid: value.username,
                email: value.email,
                password: value.password
            }).then((userRecord) => {
                response_massage = {
                    error: false,
                    massage: userRecord.uid + " account created successfully"
                };
                return null;

            }).catch((error) => {
                response_massage = {
                    error: true,
                    massage: error
                };
            });
        }

    } else {
        response_massage = {
            error: true,
            massage: error
        };
    }

    res.json(response_massage);
});

module.exports = app;