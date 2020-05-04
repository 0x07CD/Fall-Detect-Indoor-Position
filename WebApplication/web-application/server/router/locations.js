'use strict'

const admin = require('../firebase/firebaseConfig');

module.exports = (app) => {
    app.get("/locations", async (req, res) => {
        const results = await admin.firestore().collection("locations").get().then((snapShot) => {
            let data = {
                locations: []
            };

            snapShot.forEach((doc) => {
                let temp = [...data.locations];
                data.locations = [...temp, doc.id];
            });

            res.status(200);
            res.json(data);
            return;

        }).catch((e) => {
            res.status(400);
            res.send(e);
        });


    });
};