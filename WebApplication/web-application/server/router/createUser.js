'use strict'

const admin = require('../firebase/firebaseConfig');

const joi = require('@hapi/joi');

// regular expression
const username_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}$/;
const password_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}$/;

module.exports = (app) => {
    app.post("/createUser", async (req, res) => {
        const username_value = req.body.username
        const email_value = req.body.email;
        const password_value = req.body.password;
        const location = req.body.location;

        // validate username and password
        // create schema
        const schema = joi.object({
            username: joi.string().pattern(username_pattern).required(),
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
            username: username_value,
            email: email_value,
            password: password_value
        });

        // if data invalid
        if (error !== undefined) {
            res.status(400);
            res.json({
                message: error
            });
            return null;
        }

        /* check username */
        try {
            await admin.auth().getUser(value.username);
            res.status(400);
            res.json({
                message: "username already exists"
            });
            return null;

        } catch(e) {
            if (e.code !== "auth/user-not-found") {
                res.status(400);
                res.json({
                    message: e.code
                });
                return null;
            }
        }

        /* check email */
        try {
            await admin.auth().getUserByEmail(value.email);
            res.status(400);
            res.json({
                message: "email already exists"
            });
            return null;

        } catch(e) {
            if (e.code !== "auth/user-not-found") {
                res.status(400);
                res.json({
                    message: e
                });
                return null;
            }
        }

        /* create user account */
        try {
            let userRecord = await admin.auth().createUser({
                uid: value.username,
                email: value.email,
                password: value.password
            });

            try{
                await admin.firestore().collection("users").doc(userRecord.uid).set({
                    email: userRecord.email,
                    location: [
                        location
                    ]
                });
                res.status(200);
                res.json({
                    massage: "Create account successfully"
                });

            } catch(e) {
                res.status(400);
                res.json({
                    message: e
                });
            }

        } catch(e) {
            res.status(400);
            res.json({
                message: e
            });
        }

        return null;

    });
};