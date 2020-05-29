'use strict'

const admin = require('../firebase/firebaseConfig');

module.exports = (app) => {
    app.get("/locations", async (req, res) => {
        await admin.firestore().collection("locations").get().then((snapShot) => {
            let data = {
                locations: []
            };

            snapShot.forEach((doc) => {
                let temp = [...data.locations];
                data.locations = [...temp, doc.data().locationInfo.name];
            });

            res.status(200).json(data);
            return;

        }).catch((e) => {
            res.status(400).send(e.message);
        });

    });
};