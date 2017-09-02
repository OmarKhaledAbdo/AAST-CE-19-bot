const db = require('./db'),
    mongoose = require('mongoose'),
    events = mongoose.model('event'),
    users = mongoose.model('user'),
    interactor = require('../interactor');


function unsubscribe(ID, cb) {
    events.updateMany({},  {$pull: {studentIDs: ID}}).exec(cb);
}

/* To add User Details to message */
function notifyArrival (ID) {
    console.log("notify arrival");
    users.findOne({ID: ID}, function (err, user) {
       let currentEvent = user.currentEvent;
       console.log("CurrentEvent " +  currentEvent);
       if(currentEvent == null){
           return;
       }
       events.findOne({_id: currentEvent}, function (err, event) {
           event.studentIDs.forEach(function(recipient) {
              if(true || recipient != user.ID) {
                  let instructorType = event.type == 'lecture' ? 'doctor' : 'teacher assistant';
                  let messageText = user.firstName + " " + user.lastName + ' reported that the ' + instructorType + ' arrived!';
                   interactor.sendTextMessage(recipient, messageText);
               }
           });

       });
    });
}

module.exports = {
    notifyArrival: notifyArrival,
    unsubscribe: unsubscribe
};