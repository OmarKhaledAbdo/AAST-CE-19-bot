
const schedule = require('node-schedule');
const db = require('./model/db');

const mongoose = require('mongoose');

var events = mongoose.model('event');
var users = mongoose.model('user');



printAll(users);

//events.find



//clearEvents();

//initEvents();

//count(users);
//count(events);

//printAll(users);
//printAll(events);

//addStudent("113463", "A");
//
clearUsers();
//   clearEvents();

function clearUsers() {
    users.remove({}).exec(printAll(users));
}

function clearEvents() {
    events.remove({}).exec();
}

function count(t) {
    t.count({}, function(err, count) {
        console.log("Count is " + count);
    })
}



function printAll(t) {
    var cursor = t.find({}).cursor();
    cursor.on('data', function(doc) {
        console.log(doc + "\n");

    })
}

//

function addStudent(ID, group) {
    events.updateMany({ group: group }, { $push: { studentIDs: ID } }, printAll);
}


