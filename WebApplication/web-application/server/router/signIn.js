'use strict'

const admin = require('../firebase/firebaseConfig');

module.exports = (app) => {
    app.post("/signIn", async (req, res) => {
        const idToken = req.body.token;

        await admin.auth().verifyIdToken(idToken).then(async (decodedToken) => {
            let uid = decodedToken.uid;
            await admin.auth().getUser(uid).then((record) => {
                res.json({
                    massage: "passed"
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

        return null;
    });
};