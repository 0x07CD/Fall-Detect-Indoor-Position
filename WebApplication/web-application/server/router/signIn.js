'use strict'

const admin = require('../firebase/firebaseConfig');

module.exports = (app) => {
    app.post("/signIn", async (req, res) => {
        const idToken = req.body.token;
        const db = admin.firestore().collection("users");

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            try {
                const userRecord = await admin.auth().getUser(decodedToken.uid);
                try {
                    const doc = await db.doc(userRecord.uid).get();
                    res.status(200);
                    res.json({
                        username: userRecord.uid,
                        location: doc.data().locations
                    });
                } catch (e) {
                    res.status(400);
                    res.json({
                        error: e
                    });
                }

            } catch (e) {
                res.status(400);
                res.json({
                    error: e
                });
            }

        } catch (e) {
            res.status(400);
            res.json({
                error: e
            });
        }

    });
};