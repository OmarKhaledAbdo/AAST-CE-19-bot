const userControl = require('./model/userControl.js');
const request = require('request');
const eventControl = require('./model/eventControl');
require('dotenv').config();


function receivedPostback(event) {
    let senderID = event.sender.id;
    let title = event.postback.title;
    console.log(event);
    let courseName = event.postback.payload.split('/')[0];
    let group = event.postback.payload.split('/')[1];
    console.log(courseName + " " + group + "\n");
    eventControl.addUserToCourse(senderID, courseName, group);
}

function receivedMessage(event) {

    let senderID = event.sender.id;
    let recipientID = event.recipient.id;
    let timeOfMessage = event.timestamp;
    let message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    let messageId = message.mid;
    let messageText = message.text;
    let messageAttachments = message.attachments;

    userControl.isFound(senderID, function (err, found) {
        if (found) {
            if (messageText) {
                switch (messageText.toLowerCase()) {
                    case 'notify':
                        receivedNotificationQuery(senderID);
                        break;
                    case 'unsubscribe':
                        receivedUnsubscribeQuery(senderID);
                        break;
                    default:
                        sendTextMessage(senderID, messageText);
                        console.log("Send Echo");
                }
            } else if (messageAttachments) {
                sendTextMessage(senderID, "Message with attachment received");
            }
        } else {
            messageText = 'Choose your registered courses';
            sendTextMessage(senderID, messageText);
            sendButtonMessage(senderID);
            getUserInfo(senderID, function (err, info) {
                console.log(info);
                userControl.addUser({firstName: info.first_name, lastName: info.last_name, ID: senderID});
            });

        }
    });
    console.log("Received Message End");
}


function sendClassInitialisationButton(recipientId) {

}

function sendButtonMessage(recipientId) {
    let messageData =

        {
            "recipient": {
                "id": recipientId
            },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Swipe left/right for more options.",
                                buttons: [
                                    {
                                        type: "postback",
                                        title: "Web Engineering",
                                        payload: "Web Engineering/any"
                                    },
                                    {
                                        type: "postback",
                                        title: "Computing Algorithms",
                                        payload: "Computing Algorithms/any"

                                    }
                                    , {
                                        type: "postback",
                                        title: "Data Security",
                                        payload: "Data Security/any"

                                    }
                                ]
                            },
                            {
                                "title": "Swipe left/right for more options.",
                                buttons: [
                                    {
                                        type: "postback",
                                        title: "Numerical Meth. (A)",
                                        payload: "Numerical Methods/A"

                                    }
                                    ,
                                    {
                                        type: "postback",
                                        title: "Numerical Meth. (B)",
                                        payload: "Numerical Methods/B"

                                    }
                                ]
                            },
                            {
                                "title": "Swipe left/right for more options.",
                                buttons: [
                                    {
                                        type: "postback",
                                        title: "Microprocessors (A)",
                                        payload: "Microprocessors Systems/A"

                                    },
                                    {
                                        type: "postback",
                                        title: "Microprocessors (B)",
                                        payload: "Microprocessors Systems/B"

                                    }
                                ]

                            },
                            {
                                "title": "Swipe left/right for more options.",
                                buttons: [

                                    {
                                        type: "postback",
                                        title: "System Prog. (A)",
                                        payload: "Systems Programming/A"

                                    },
                                    {
                                        type: "postback",
                                        title: "System Prog. (B)",
                                        payload: "Systems Programming/B"

                                    }
                                ]

                            },

                            {
                                "title": "Swipe left/right for more options.",
                                buttons: [
                                    {
                                        type: "postback",
                                        title: "Database Systems (A)",
                                        payload: "Database Systems/A"

                                    },
                                    {
                                        type: "postback",
                                        title: "Database Systems (B)",
                                        payload: "Database Systems/B"
                                    }
                                ]

                            }


                        ]
                    }
                }
            }
        };
    callSendAPI(messageData);
}

function sendGenericMessage(recipientId, messageText) {
    // To be expanded in later sections
}

function sendTextMessage(recipientId, messageText, callback) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };
    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.ACCESS_TOKEN},
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let recipientId = body.recipient_id;
            let messageId = body.message_id;
            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            //console.error(response);
            //console.error(error);
        }
    });
}

function getUserInfo(senderID, callback) {
    request({
        uri: 'https://graph.facebook.com/v2.6/' + senderID,
        qs: {
            access_token: process.env.ACCESS_TOKEN
        },
        method: 'GET'
    }, function (error, response, body) {
        if (typeof body !== "object") {
            body = JSON.parse(body);
        }
        console.log(body);
        if (!error && response.statusCode == 200) {
            callback(null, body);
        } else {
            callback(error, null);
        }
    });
}


module.exports = {
    receivedMessage: receivedMessage,
    sendTextMessage: sendTextMessage,
    getUserInfo: getUserInfo,
    receivedPostback: receivedPostback
};

const userAction = require('./model/userAction');


function receivedNotificationQuery(ID) {
    userAction.notifyArrival(ID);
}

function receivedUnsubscribeQuery(ID) {
    userAction.unsubscribe(ID);
}