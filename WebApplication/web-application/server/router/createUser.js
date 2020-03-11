'use strict'

const admin = require('../firebase/firebaseConfig');

const joi = require('@hapi/joi');

// regular expression
const username_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}$/;
const password_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}$/;

module.exports = (app) =>{
    app.post("/createUser", async (req, res) => {
        const username_value = req.body.username
        const email_value = req.body.email;
        const password_value = req.body.password;
    
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
            res.json({
                error: error
            });
            return null;
        }
    
        const username_check = await admin.auth().getUser(value.username).then(() => {
            res.json({
                error: "username already exists"
            });
            return false;    // not passed
    
        }).catch((error) => {
            // other cases
            if (error.code !== "auth/user-not-found") {
                res.json({
                    error: error
                });
                return false;   // not passed
            }
            return true;    // passed
        });
    
        if (!username_check) {
            return null;
        }
    
        const email_check = await admin.auth().getUserByEmail(value.email).then(() => {
            res.json({
                error: "email already exists"
            });
            return false;   // not passed
    
        }).catch((error) => {
            // other cases
            if (error.code !== "auth/user-not-found") {
                res.json({
                    error: error
                });
                return false;   // not passed
            }
            return true;    // passed
        });
    
        if (!email_check) {
            return null;
        }
            
        // create user account with admin sdk
        const create_account_check = await admin.auth().createUser({
            uid: value.username,
            email: value.email,
            password: value.password
        }).then((userRecord) => {
            return {
                username: userRecord.uid,
                email: userRecord.email
            };
    
        }).catch((error) => {
            res.json({
                error: error
            });
            return false;
        });

        if (!create_account_check) {
            return null;
        }

        // add user information to firestore
        await admin.firestore().collection("users").doc(create_account_check.username).set({
            email: create_account_check.email
        }).then(() => {
            res.json({
                massage: "successfully"
            });
            return null;

        }).catch((error) => {
            res.json({
                error: error
            });
        });
    
        return null;
    });
};