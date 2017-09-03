require('dotenv').config();
const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    db = require('./model/db'),
    eventControl = require('./model/eventControl'),
    mongoose = require('mongoose'),
    interactor = require('./interactor'),
    roomInformer = require('./roomInformer');


// console.log("AccessToken " + process.env.ACCESS_TOKEN);
console.log("DBURI " + process.env.MONGODB_URI);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const server = app.listen(process.env.PORT || 5000, function () {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});


roomInformer.run();
eventControl.loadSchedule();


app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.VERIFICATION_KEY) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

/* Handling all messenges */
app.post('/webhook', function (req, res) {
    let data = req.body;
    // Make sure this is a page subscription
    if (data.object === 'page') {
        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function (entry) {
            let pageID = entry.id;
            let timeOfEvent = entry.time;
            // Iterate over each messaging event
            entry.messaging.forEach(function (event) {
                if (event.message) {
                    interactor.receivedMessage(event);
                }
                else if (event.postback) {
                    interactor.receivedPostback(event);
                }
                else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });
        res.sendStatus(200);
    }
});