const schedule = require('node-schedule'),
    mongoose = require('mongoose'),
    interactor = require('./interactor'),
    events = mongoose.model('event'),
    userControl = require('./model/userControl'),
    eventControl = require('./model/eventControl');


const vowels = 'aeoiuh';
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


module.exports.run = function () {

    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(0, 6)];  //start, end, step(optional)
    rule.hour = [8, 10, 12, 14];
    rule.minute = [35, 36, 37, 38, 39];
    rule.second = [new schedule.Range(0, 59, 15)];

    schedule.scheduleJob(rule, function () {

        let curTime = (function () {
            let curTime = new Date();
            return weekdays[curTime.getDay()] + '-' + curTime.getHours();
        })();

        console.log("Current Time " + curTime + "\n\n");

        let cursor = events.find({date: curTime}).cursor();
        cursor.on('data', function (event) {
            console.log(event);
            event.studentIDs.forEach(function (recipient) {
                let messageText = 'You have ' + (vowels.indexOf(event.name.charAt(0)) !== -1 ? 'an ' : 'a ') + event.name + ' ' + event.type + ' at room ' + event.room + " in 10 minutes!";
                interactor.sendTextMessage(recipient, messageText);

                /* Augments the current event for each user to enable further notifications related to the event */
                userControl.assignEvent(recipient, event._id);
            });
        });
    });
};