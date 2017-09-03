const mongoose = require('mongoose');//.set('debug', true);
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    ID:String,
    currentEvent: Schema.Types.ObjectId
});

const users = module.exports = mongoose.model('user', userSchema);