//const mongoose = require('mongoose').set('debug', true);
const Schema = mongoose.Schema;

var commitmentSchema = new Schema({
    name: String,
    group: String,
    room: String,
    date: String,
    studentIDs: [],
});

var commitment = module.exports = mongoose.model('commitment', commitmentSchema);