const db = require('./db');
const mongoose = require('mongoose');
const events = mongoose.model('event');
const users = mongoose.model('user');
const interactor = require('../interactor');


/* To add User Details to message */
function notifyArrival (ID) {
    console.log("notify arrival");
    users.findOne({ID: ID}, function (err, user) {
       var currentEvent = user.currentEvent;
       console.log("currentEvent " +  currentEvent);

       if(currentEvent == null){
           return;
       }

       events.findOne({_id: currentEvent}, function (err, event) {
           event.studentIDs.forEach(function(recipient) {
              if(true || recipient != user.ID) {
                  var instructorType = event.type == 'lecture' ? 'doctor' : 'teacher assistant';
                  var messageText = user.firstName + " " + user.lastName + ' reported that the ' + instructorType + 'arrived!';
                   interactor.sendTextMessage(recipient, messageText);
               }
           });

       });


    });
}



module.exports = {
    notifyArrival: notifyArrival
};