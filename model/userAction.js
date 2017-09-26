const db = require('./db'),
    mongoose = require('mongoose'),
    events = mongoose.model('event'),
    users = mongoose.model('user'),
    interactor = require('../interactor');

module.exports = {
    notifyArrival: function (ID) {
        users.findOne({ID: ID}, function (err, user) {
            if(user === null) {
                return;
            }
            let currentEvent = user.currentEvent;
            if(currentEvent == null){
                const messageText = 'Sorry, there are no courses running!';
                interactor.sendTextMessage(ID, messageText);
                return;
            }
            events.findOne({_id: currentEvent}, function (err, event) {
                event.studentIDs.forEach(function(recipient) {
                    let messageText;
                    if(recipient != user.ID) {
                        let instructorType = event.type === 'lecture' ? 'lecturer' : 'teacher assistant';
                        messageText = user.firstName + " " + user.lastName + ' reported that your ' + instructorType + ' has arrived!';
                    } else {
                        messageText = 'Thanks ' + user.firstName + '!';
                    }
                    interactor.sendTextMessage(recipient, messageText);
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