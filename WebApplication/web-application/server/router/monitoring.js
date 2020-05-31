'use strict'

const admin = require('../firebase/firebaseConfig');

module.exports = (app) => {
    app.post("/monitoring/status", async (req, res) => {
        const data = req.body;
        const requestReferenceNodeAddress = data.address;        // requestReferenceNodeAddress is request reference node mac address
        const db = admin.firestore().collection("monitoring");
        try {
            console.log("updating...");
            await db.doc(data.location).update({
                wearableDevice: data.wearableDevice
            });
            console.log("update complete...");
            res.status(200).send("success");
        } catch (e) {
            res.status(400);
        }
    });

    app.post("/monitoring/rssi", (req, res) => {
        const data = req.body;
        try {
            const db = admin.firestore().collection("monitoring").doc("test");
            try {
                db.update({
                    rssi: data.wearableDevice[0].rssi
                });
                res.status(200).send("success");
            } catch (e) {
                res.status(400);
            }
        } catch (e) {
            res.status(400);
        }

    });
};