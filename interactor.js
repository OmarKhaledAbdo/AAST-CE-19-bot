const userControl = require('./model/userControl.js'),
      request = require('request'),
      eventControl = require('./model/eventControl');
require('dotenv').config();

const courseButtonMessage = {
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
};




function receivedPostback(event) {
    let senderID = event.sender.id;
    let title = event.postback.title;
    let payload = event.postback.payload;

    switch (payload) {
        case 'GET_STARTED':
            receivedGetStarted(senderID);
            break;
        case 'subscribe':
            receivedSubscribeQuery(senderID);
            break;
        case 'unsubscribe':
            receivedUnsubscribeQuery(senderID);
            break;
        default:
            receivedCourseRegistration(senderID, payload);
        //case ''
    }

   console.log(event + "\n");


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

    sendTextMessage(senderID, messageText);

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
            sendCourseRegistrationMessage(senderID);
            getUserInfo(senderID, function (err, info) {
                console.log(info);
                userControl.addUser({firstName: info.first_name, lastName: info.last_name, ID: senderID});
            });

        }
    });
    console.log("Received Message End");
}


function sendCourseRegistrationMessage(recipientId) {

    const messageData = {
        "recipient": {
            "id": recipientId
        },
        "message": courseButtonMessage
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
            console.error(error);
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
    userAction.unsubscribe(ID, function () {
        const messageText = "You have Successfully unsubscribed from all your registered courses, you won't receive and notifications anymore and you won't be able to issue any notifications!"
        sendTextMessage(ID, messageText);
    });
}

function receivedGetStarted(senderID) {
    getUserInfo(senderID, function (err, info) {
        const messageText = 'Hi ' + info.first_name + ', start by clicking on the menu and subscribe to your registered courses!';
        sendTextMessage(senderID, messageText);
        userControl.addUser({firstName: info.first_name, lastName: info.last_name, ID: senderID});
    });
}

function receivedSubscribeQuery(senderID) {
    sendCourseRegistrationMessage(senderID);

}

function receivedCourseRegistration(senderID, query) {
    let courseName = query.split('/')[0];
    let group = query.split('/')[1];
    console.log(courseName + " " + group + "\n");
    eventControl.addUserToCourse(senderID, courseName, group);
}