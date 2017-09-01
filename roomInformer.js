const schedule = require('node-schedule');
var mongoose = require('mongoose');
var interactor = require('./interactor');
var events = mongoose.model('event');
var users = mongoose.model('user');
var userControl = require('./model/userControl');
var eventControl = require('./model/eventControl');

var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function run() {
    console.log("Run scheduler");

    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(0, 6)];
    rule.hour = [8, 10, 12, 14];
    rule.minute = [0];
    rule.second = [0]; //start, end, step


    schedule.scheduleJob(rule, function () {
        var curTime = (function () {
            var curTime = new Date();
            return weekdays[curTime.getDay()] + '-' + curTime.getHours();
        })();

        console.log("Current Time " + curTime + "\n\n");

        var cursor = events.find({date: curTime}).cursor();

        cursor.on('data', function (event) {
            console.log(event);
            event.studentIDs.forEach(function (recipient) {
                var messageText = 'You have ' + ("aeoiuh".indexOf(event.name.charAt(0)) !== -1 ? 'an ' : 'a ') + event.name + ' ' + event.type + ' at room ' + event.room + " in 5 minutes";
                interactor.sendTextMessage(recipient, messageText);
                userControl.assignEvent(recipient, event._id);
            });
        });
    });
}
module.exports.run = run;