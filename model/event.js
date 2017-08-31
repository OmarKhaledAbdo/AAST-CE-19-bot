const mongoose = require('mongoose');//.set('debug', true);
const Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: String,
    type: String,
    room: String,
    date: String,
    studentIDs: [],
    group: String
});


var events = module.exports = mongoose.model('event', eventSchema);


