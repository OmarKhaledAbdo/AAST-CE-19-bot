const db = require('./db'),
    mongoose = require('mongoose'),
    events = mongoose.model('event');


function addEvent(name, type, room, date, group) {

    if (typeof group === 'undefined') {
        group = 'any';
    }
    /* Attempts to insert a new event if a similar one is not present, excluding studentID from the comparison */
    let newEvent = {name: name, type: type, room: room, date: date, studentIDs: [], group: group};
    let queryEvent = {name: name, type: type, room: room, date: date, group: group};

    events.findOne(queryEvent, function (err, doc) {
        if(!err && !doc) {
            let data = new events(newEvent);
            data.save();
        }
    });
}

function loadSchedule() {

    addEvent("Web Engineering", "lecture", "349", "Sunday-8");
    addEvent("Web Engineering", "lab", "G310", "Sunday-14");

    addEvent("Computing Algorithms", "lecture", "351", "Tuesday-10");
    addEvent("Computing Algorithms", "section", "441", "Monday-12");

    addEvent("Data Security", "lecture", "410", "Sunday-10");
    addEvent("Data Security", "section", "349", "Sunday-12");


    addEvent("Database Systems", "lecture", "349", "Wednesday-10");
    addEvent("Database Systems", "section", "241", "Monday-8", "A");
    addEvent("Database Systems", "section", "239", "Tuesday-8", "B");
    addEvent("Database Systems", "lab", "241", "Sunday-10", "A");
    addEvent("Database Systems", "lab", "239", "Wednesday-12", "B");

    addEvent("Numerical Methods", "lecture", "351", "Monday-10");
    addEvent("Numerical Methods", "section", "441", "Tuesday-8", "A");
    addEvent("Numerical Methods", "section", "349", "Thursday-12", "B");

    addEvent("Microprocessors Systems", "lecture", "349", "Wednesday-8");
    addEvent("Microprocessors Systems", "section", "326", "Sunday-12", "A");
    addEvent("Microprocessors Systems", "section", "G310", "Sunday-8", "B");
    addEvent("Microprocessors Systems", "lab", "326", "Tuesday-10", "A");
    addEvent("Microprocessors Systems", "lab", "326", "Monday-8", "B");

    addEvent("Systems Programming", "lecture", "351", "Thursday-10");
    addEvent("Systems Programming", "section", "241", "Monday-12", "A");
    addEvent("Systems Programming", "section", "G110", "Tuesday-12", "B");

    addEvent("Automatic Control Systems", "lecture", "349", "Thursday-8");
    addEvent("Automatic Control Systems", "section", "308", "Thursday-12", "A");
    addEvent("Automatic Control Systems", "section", "308", "Thursday-14", "B");



    /* Automatic control to be added */
}

module.exports = {
    addUserToCourse: function (ID, name, group) {
        events.updateMany({name: name, group: { $in: [group, 'any'] }}, {$addToSet: {studentIDs: ID}}).exec();
    },
    loadSchedule: loadSchedule
};