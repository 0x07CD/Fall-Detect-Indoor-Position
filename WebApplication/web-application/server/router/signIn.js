'use strict'

const admin = require('../firebase/firebaseConfig');

module.exports = (app) => {
    app.post("/signIn", async (req, res) => {
        const idToken = req.body.token;

        const verify_token_check = await admin.auth().verifyIdToken(idToken).then(async (decodedToken) => {
            return {
                uid: decodedToken.uid
            };

        }).catch((error) => {
            res.json({
                error: error
            });
        });

        if (!verify_token_check) {
            return null;
        }

        await admin.auth().getUser(verify_token_check.uid).then(() => {
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
    });
};