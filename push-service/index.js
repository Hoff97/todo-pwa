const webPush = require('web-push');
var express = require('express');

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.log("You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
        "environment variables. You can use the following ones:");
    console.log(webPush.generateVAPIDKeys());
    return;
}

webPush.setVapidDetails(
    'https://todo.haskai.de/',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const payloads = {};

var app = express();
route = '/test/';

app.post(route + 'sendNotification', function (req, res) {
    const subscription = req.body.subscription;
    const payload = req.body.payload;
    const options = {
        TTL: req.body.ttl
    };

    setTimeout(function () {
        webPush.sendNotification(subscription, payload, options)
            .then(function () {
                res.sendStatus(201);
            })
            .catch(function (error) {
                console.log(error);
                res.sendStatus(500);
            });
    }, req.body.delay * 1000);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});