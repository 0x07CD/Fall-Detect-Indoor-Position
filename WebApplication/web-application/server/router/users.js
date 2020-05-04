'use strict'

const admin = require('../firebase/firebaseConfig');

module.exports = (app) => {
    app.get("/users/location", async (req, res) => {
        try {
            const db = await admin.firestore().collection("users").doc(req.body.username);
            try {
                const doc = await db.get();
                if (!doc.exists) {
                    res.status(400);
                    res.json({
                        error: "No match"
                    });    
                } else {
                    res.status(200);
                    res.json({
                        location: doc.data().location
                    });
                }

            } catch(error) {
                res.status(400);
                res.json({
                    error: error
                });
            }

        } catch(error) {
            res.status(400);
            res.json({
                error: error
            });
        }
        
    });
};