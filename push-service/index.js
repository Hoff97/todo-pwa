const webPush = require('web-push');
var express = require('express');
var bodyParser = require('body-parser');

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

var app = express();
app.use(bodyParser.json());

app.post('/sendNotification', function (req, res) {
    console.log('Got request to send notification');

    if(req.header("auth-pw") !== process.env.SERVICE_PW) {
        console.log('Unauthorized request');
        res.sendStatus(401);
        return;
    }

    const subscription = req.body.subscription;
    const payload = req.body.payload;
    const options = {
        TTL: req.body.ttl
    };

    setTimeout(function () {
        webPush.sendNotification(subscription, JSON.stringify(payload), options)
            .then(function () {
                res.sendStatus(201);
            })
            .catch(function (error) {
                console.log(error);
                res.sendStatus(500);
            });
    }, req.body.delay * 1000);
});

app.listen(4000, function () {
    console.log('Push service listening on port 4000!');
});