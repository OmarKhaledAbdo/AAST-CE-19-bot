const mongoose = require('mongoose').set('debug', true);
const Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    ID:String,
    currentEvent: Schema.Types.ObjectId
});

var users = module.exports = mongoose.model('user', userSchema);