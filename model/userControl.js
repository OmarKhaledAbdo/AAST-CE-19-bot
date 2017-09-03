const db = require('./db'),
    mongoose = require('mongoose'),
    events = mongoose.model('event'),
    users = mongoose.model('user');


module.exports = {
    addUser: function (user) {
        data = new users(user);
        data.save();
    },
    isFound: function (ID, callback) {
        users.findOne({ID: ID},  function(err, result) {
            if(err) {
                callback(err, null);
            }else {
                callback(null, result !== null);
            }
        });
    },
    assignEvent: function (ID, eventID) {
        users.findOneAndUpdate({ID: ID}, {currentEvent: eventID}).exec();
    }
};
