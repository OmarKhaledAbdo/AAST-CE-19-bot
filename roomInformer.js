const schedule = require('node-schedule'),
    mongoose = require('mongoose'),
    interactor = require('./interactor'),
    events = mongoose.model('event'),
    userControl = require('./model/userControl'),
    eventControl = require('./model/eventControl');

module.exports.run = function () {

    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(0, 6)];  //start, end, step(optional)
    rule.hour = [8, 10, 12, 14];
    rule.minute = [25];
    rule.second = 0;

    schedule.scheduleJob(rule, function () {

        let curTime = (function () {
            const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            let curTime = new Date();
            return weekdays[curTime.getDay()] + '-' + curTime.getHours();
        })();

        //console.log("Current Time " + curTime + "\n\n");
        let cursor = events.find({date: curTime}).cursor();

        cursor.on('data', function (event) {
            console.log(event);

            event.studentIDs.forEach(function (recipient) {
                const vowels = 'AEOIUH';
                let messageText = 'You have ' + (vowels.indexOf(event.name.charAt(0)) !== -1 ? 'an ' : 'a ') + event.name + ' ' + event.type + ' at room ' + event.room + " in 5 minutes!";
                interactor.sendTextMessage(recipient, messageText);
                /* Augments the current event for each user to enable further notifications related to the event */
                userControl.assignEvent(recipient, event._id);
                /* Remove the event to prevent any further notifications */
                const slotDuration = 100 * 60 * 1000;
                setTimeout(function () {
                    userControl.assignEvent(recipient, null)
                }, slotDuration);

            });
        });
    });
};