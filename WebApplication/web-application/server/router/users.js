'use strict'

const admin = require('../firebase/firebaseConfig');
const joi = require('@hapi/joi');

// regular expression
const username_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}$/;
const password_pattern = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}$/;

module.exports = (app) => {

    app.post("/users/createUser", async (req, res) => {
        const username_value = req.body.username;
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
            res.status(400).json({
                message: "username already exists"
            }
            );
            return null;

        } catch (e) {
            if (e.code !== "auth/user-not-found") {
                res.status(400).json({
                    message: e.code
                });
                return null;
            }
        }

        /* check email */
        try {
            await admin.auth().getUserByEmail(value.email);
            res.status(400).json({
                message: "email already exists"
            });
            return null;

        } catch (e) {
            if (e.code !== "auth/user-not-found") {
                res.status(400).json({
                    message: e.message
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

            try {
                await admin.firestore().collection("users").doc().set({
                    username: userRecord.uid,
                    email: userRecord.email,
                    locations: [
                        location
                    ]
                });
                res.status(200).json({
                    massage: "Create account successfully"
                });

            } catch (e) {
                res.status(400).json({
                    message: e.message
                });
            }

        } catch (e) {
            res.status(400).json({
                message: e.message
            });
        }

        return null;
    });

    app.post("/users/signIn", async (req, res) => {
        const idToken = req.body.token;
        const db = admin.firestore().collection("users");

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            try {
                const userRecord = await admin.auth().getUser(decodedToken.uid);
                try {
                    const snapshot = await db.where("username", "==", userRecord.uid).get();
                    if (!snapshot.empty) {
                        snapshot.forEach((doc) => {
                            res.status(200).json({
                                id: doc.id,
                                username: userRecord.uid,
                                locations: doc.data().locations
                            });
                            return null;
                        });

                    } else {
                        res.status(400).json({
                            message: "user doesn't exist"
                        });
                    }
                } catch (e) {
                    res.status(400).json({
                        message: e.message
                    });
                }

            } catch (e) {
                res.status(400).json({
                    message: e.message
                });
            }

        } catch (e) {
            res.status(400).json({
                message: e.message
            });
        }

    });

    app.get("/users/locations", async (req, res) => {
        try {
            const db = await admin.firestore().collection("users").doc(req.query.id);
            try {
                const doc = await db.get();
                if (!doc.exists) {
                    res.status(400).json({
                        message: "user doesn't exist"
                    });
                } else {
                    res.status(200).json({
                        location: doc.data()
                    });
                }

            } catch (e) {
                res.status(400).json({
                    message: e.message
                });
            }

        } catch (e) {
            res.status(400).json({
                message: e.message
            });
        }

    });

    app.post("/users/saveSubscription", async (req, res) => {
        const payload = req.body;
        await admin.firestore().collection("users").doc(payload.id).update({
            subscription: JSON.parse(payload.subscription)    
        });

        res.status(200).json({ message: 'success' });
    });
};