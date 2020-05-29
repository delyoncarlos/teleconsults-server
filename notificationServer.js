const webPush = require('web-push');
const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const app = express();
const port = 6000;
const route = '/';
const { saveSubscription, getSubscription, disconnectMongo } = require('./src/utils');

app.use(cors());
app.use(bodyParser.json());

const publicKey = 'BMla0eSfPOidC85n-xobdVYuaE87zcRjq_TbVt1cdv0ryCEAO36BDHZ_6o6YemCR_g2XlrXNt4fzmtYvVU7Na3Y';
const privateKey = 'LCtLDxQRLOcvfb-MSDvPrvagyBGK-Uq61-H6E3rxeI4';

// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
    'http://18.217.185.213/',
    publicKey, privateKey
);

app.get(route + 'vapidPublicKey', function (req, res) {
    res.send(publicKey);
});

app.post(route + 'register', function (req, res) {

    // saving subscription in the DB
    const subscription = {
        username: req.body.username,
        subscription: req.body.subscription
    };
    saveSubscription({ subscription }).catch(err => 'error: =============>'+console.log(err));
    disconnectMongo();


    // console.log('received this:'); // remove
    // console.log(req.body.subscription); // remove
    // subscriptionGlobal = req.body.subscription; // remove

    // webPush.sendNotification(req.body.subscription, 'Direct response', { "TTL": 0 })
    //     .then(function () {
    //         res.sendStatus(201);
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //         res.sendStatus(500);
    //     });

    res.sendStatus(201);
});

app.post(route + 'sendNotification', async function (req, res) {
    // searching notification in db
    const {subscription} = await getSubscription({username: req.body.username});
    console.log('sending this:'); // remove
    console.log(subscription.subscription); // remove
    console.log(req.body.message); // remove

    setTimeout(function () {
        webPush.sendNotification(subscription.subscription, req.body.message, { "TTL": 0 })
            .then(function () {
                res.sendStatus(201);
            })
            .catch(function (error) {
                console.log(error);
                res.sendStatus(500);
            });
    }, 4000);
});

app.listen(port, () => console.log(`📌 Push server listening at http://localhost:${port}`))


