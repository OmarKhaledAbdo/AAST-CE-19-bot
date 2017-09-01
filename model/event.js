const mongoose = require('mongoose');//.set('debug', true);
const Schema = mongoose.Schema;

let eventSchema = new Schema({
    name: String,
    type: String,
    room: String,
    date: String,
    studentIDs: [],
    group: String
});

let events = module.exports = mongoose.model('event', eventSchema);