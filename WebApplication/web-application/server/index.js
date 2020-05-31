'use strict'

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const admin = require('./firebase/firebaseConfig');
const webpush = require('web-push');

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ["http://localhost:3000", "https://ce62-29.firebaseapp.com"]
const corsOption = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    }
}
app.use(cors(corsOption));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./router/users')(app);
require('./router/locations')(app);
require('./router/monitoring')(app);

app.get("/test", (req, res) => {
    res.status(200).send("OK");
});

const sendNotification = async (subscription, dataToSend = '') => {
    const options = {
        vapidDetails: {
            subject: "mailto:grishacker@gmail.com",
            publicKey: "BOQ4-GDtCdX8OB3sb_6R3NpagwxVuUWFelVysbvunzysL_tL0L-nCIo-FRxMdLddi01RSY7TgJ9ZbkfWrKR6p7M",
            privateKey: "YL68qOsUAv15c-60DQKaAmQdvhEFq730lXZ7dOVbbFw"
        }
    }
    console.log(subscription);
    console.log(options);
    try {
        const response = await webpush.sendNotification(subscription, dataToSend, options);
        console.log(response);
    } catch (e) {
        console.log(e);
    }
    
};

/* exports.updatePosition = functions.firestore.document("monitoring/{locationName}").onWrite((change, context) => {
    try {
        let dataUpdated = change.after.data();
        let keys = Object.keys(dataUpdated);

        // To ensure that reference node are changed more than or equal to 3

    } catch (e) {
        console.log(e);
    }
}); */

exports.fallDetected = functions.firestore.document("monitoring/{locationName}").onWrite((change, context) => {
    try {
        console.log(change.after.data());
        const docData = change.after.data();
        const wearableDeviceList = docData.wearableDevice;
        wearableDeviceList.forEach((deviceInfo) => {
            if (deviceInfo.fall === true) {
                admin.firestore().collection("users").where("locations", "array-contains", context.params.locationName).get().then((query) => {
                    query.forEach((doc) => {
                        if (doc.data().subscription !== undefined) {
                            sendNotification(doc.data().subscription, `device address ${deviceInfo.address} fall detected`);
                        }
                        return;
                    });
                    return;
                }).catch((e) => {
                    console.log(e)
                    return;
                });
                return;
            }
        });
    } catch (e) {
        console.log(e);
    }
});

exports.api = functions.https.onRequest(app);