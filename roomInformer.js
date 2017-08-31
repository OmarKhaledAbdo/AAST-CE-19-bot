const schedule = require('node-schedule');
var mongoose = require('mongoose');
var fb = require('./interactor.js');
var events = mongoose.model('event');
var users = mongoose.model('user');
var userControl = require('./model/userControl.js');
var eventControl = require('./model/eventControl');

var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


function isVowel (c) {
    return "aeoiu".indexOf(c) != -1;

}


    function run(){
        console.log("Run scheduler");

        var rule = new schedule.RecurrenceRule();

        rule.dayOfWeek = [new schedule.Range(0, 6)];

        rule.hour = [new schedule.Range(0, 23)];

        rule.minute = [new schedule.Range(0, 59)];

        rule.second = [new schedule.Range(0, 59, 30)]; //start, end, step


        schedule.scheduleJob(rule, function () {
            var curTime = (function() {
                var curTime = new Date();
                return weekdays[curTime.getDay()] + '-' + curTime.getHours();
            })();

            console.log("CurTime " + curTime  + "\n\n");

            var cursor = events.find({date: curTime}).cursor();

            cursor.on('data', function (event) {
                console.log(event);
                event.studentIDs.forEach(function(recipient) {

                    var messageText = 'You have ' + (isVowel(event.name.charAt(0)) ? 'an ' : 'a ') +  event.name +
                        ' ' + event.type +  ' in room' + event.room
                    console.log(messageText)
                    fb.sendTextMessage(recipient, messageText);

                    //console.log("EventID " + event._id + "\n");
                    users.findOneAndUpdate({ID: recipient}, {currentEvent: event._id}).exec();
                    //userControl.setUsersState(doc.group);
                });



            });

        });
    }



    module.exports.run = run;
