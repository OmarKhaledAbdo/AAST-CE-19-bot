const schedule = require('node-schedule');
let mongoose = require('mongoose');
let interactor = require('./interactor');
let events = mongoose.model('event');
let userControl = require('./model/userControl');
let eventControl = require('./model/eventControl');


const vowels = 'aeoiuh';
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function run() {

    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(0, 6)];
    rule.hour = [8, 10, 12, 14];
    rule.minute = 48;
    //rule.second = 0; //start, end, step


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
                let messageText = 'You have ' + (vowels.indexOf(event.name.charAt(0)) !== -1 ? 'an ' : 'a ') + event.name + ' ' + event.type + ' at room ' + event.room + " in 5 minutes";
                interactor.sendTextMessage(recipient, messageText);
                userControl.assignEvent(recipient, event._id);
            });
        });
    });
}
module.exports.run = run;