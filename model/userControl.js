var db = require('./db');
var mongoose = require('mongoose');
var events = mongoose.model('event');
var users = mongoose.model('user');



function printAll(t) {
    console.log("Print after state update\n");
    var cursor = t.find({}).cursor();
    cursor.on('data', function(doc) {
        console.log(doc + "\n");

    })
}


function addUser(user) {
    data = new users(user);
    data.save();
}




function isFound(ID, callback) {
    //printAll();
    users.findOne({ID: ID},  function(err, result) {
        console.log(result);
        if(err) {
            callback(err, null);
        }else {
            callback(null, result !== null);
        }
    });
}


module.exports = {
    addUser: addUser,
    isFound: isFound
};