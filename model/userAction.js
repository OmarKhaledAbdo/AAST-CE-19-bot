const db = require('./db'),
    mongoose = require('mongoose'),
    events = mongoose.model('event'),
    users = mongoose.model('user'),
    interactor = require('../interactor');

module.exports = {
    notifyArrival: function (ID) {
        users.findOne({ID: ID}, function (err, user) {
            let currentEvent = user.currentEvent;
            console.log("CurrentEvent " +  currentEvent);
            if(currentEvent == null){
                const messageText = 'Sorry, currently there are no courses running!';
                interactor.sendTextMessage(ID, messageText);
                return;
            }
            events.findOne({_id: currentEvent}, function (err, event) {
                event.studentIDs.forEach(function(recipient) {
                    /* Have not decided yet whether I'll send the message to the person who issued the notification or not*/
                    if(true || recipient != user.ID) {
                        let instructorType = event.type === 'lecture' ? 'doctor' : 'teacher assistant';
                        let messageText = user.firstName + " " + user.lastName + ' reported that your ' + instructorType + ' has arrived!';
                        interactor.sendTextMessage(recipient, messageText);
                    }
                });

            });
        });
    }
    ,
    unsubscribe: function (ID, cb) {
        events.updateMany({},  {$pull: {studentIDs: ID}}).exec(cb);
        users.updateOne({ID: ID}, {$set: {currentEvent: null}}).exec();
    }
};