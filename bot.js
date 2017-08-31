    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();
    const db = require('./model/db');
    const mongoose = require('mongoose');
    const interactor = require('./interactor.js');
    const roomInformer = require('./roomInformer.js');
    var events = mongoose.model('event');


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));


    //printAll();

    const server = app.listen(process.env.PORT || 5000, function () {
        console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
    });


    roomInformer.run();

    app.get('/webhook', function(req, res) {
      if (req.query['hub.mode'] === 'subscribe' &&
          req.query['hub.verify_token'] === '1997') {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
      } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
      }
    });


    /* Handling all messenges */
    app.post('/webhook', function (req, res) {
      var data = req.body;
      // Make sure this is a page subscription
      if (data.object === 'page') {
        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
          var pageID = entry.id;
          var timeOfEvent = entry.time;
          // Iterate over each messaging event
          entry.messaging.forEach(function(event) {
            if (event.message) {
               interactor.receivedMessage(event);
            }
            else if(event.postback) {
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