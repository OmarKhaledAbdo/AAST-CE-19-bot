const db = require('./db');
let mongoose = require('mongoose');
let events = mongoose.model('event');


function addEvent(name, type, room, date, group) {
    if (typeof group === 'undefined') {
        group = 'any';
    }
    let newEvent = {name: name, type: type, room: room, date: date, studentIDs: [], group: group};
    events.findOneAndUpdate(newEvent, newEvent, {upsert: true}).exec();
}

function addUserToCourse(ID, name, group) {
    events.updateMany({name: name, group: { $in: [group, 'any'] }}, {$addToSet: {studentIDs: ID}}).exec();
}


function loadSchedule() {

    addEvent("Web Engineering", "lecture", "349", "Saturday-8");
    addEvent("Web Engineering", "lab", "G310", "Saturday-16");

    addEvent("Computing Algorithms", "lecture", "351", "Tuesday-10");
    addEvent("Computing Algorithms", "section", "441", "Monday-12");

    addEvent("Data Security", "lecture", "410", "Saturday-10");
    addEvent("Data Security", "section", "349", "Saturday-12");


    addEvent("Database Systems", "lecture", "349", "Wednesday-10");
    addEvent("Database Systems", "section", "241", "Monday-8", "A");
    addEvent("Database Systems", "section", "239", "Tuesday-8", "B");
    addEvent("Database Systems", "lab", "241", "Saturday-14", "A");  //changed from 10 to 14
    addEvent("Database Systems", "lab", "G310", "Wednesday-14", "A");

    addEvent("Numerical Methods", "lecture", "351", "Saturday-10");
    addEvent("Numerical Methods", "section", "441", "Tuesday-8", "A");
    addEvent("Numerical Methods", "section", "349", "Thursday-12", "B");

    addEvent("Microprocessors Systems", "lecture", "349", "Wednesday-8");
    addEvent("Microprocessors Systems", "section", "326", "Saturday-12", "A");
    addEvent("Microprocessors Systems", "section", "G310", "Saturday-8", "B");
    addEvent("Microprocessors Systems", "lab", "326", "Tuesday-10", "A");
    addEvent("Microprocessors Systems", "lab", "326", "Monday-8", "B");

    addEvent("Systems Programming", "lecture", "351", "Thursday-10");
    addEvent("Systems Programming", "section", "241", "Monday-12", "A");
    addEvent("Systems Programming", "section", "G310", "Tuesday-12", "B");
}


loadSchedule();

function printAll(t) {
    let cursor = t.find({}).cursor();
    cursor.on('data', function (doc) {
        console.log(doc + "\n");

    })
}

module.exports = {
    addUserToCourse: addUserToCourse
};