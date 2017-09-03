const userControl = require('./model/userControl.js'),
      request = require('request'),
      eventControl = require('./model/eventControl');
      FacebookAPI = require('./FacebookAPI');
require('dotenv').config();


const courseButtonMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Swipe right for more options.",
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
                    "title": "Swipe left for more options.",
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
        case  'notify':
            receivedNotificationQuery(senderID);
            break;
        default:
            receivedCourseRegistration(senderID, payload);
    }
}

function receivedMessage(event) {

    let senderID = event.sender.id;
    let recipientID = event.recipient.id;
    let timeOfMessage = event.timestamp;
    let message = event.message;
    let messageId = message.mid;
    let messageText = message.text;
    let messageAttachments = message.attachments;


    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));


    if (messageText || messageAttachments) {
        const messageText = 'Sorry, I\'m a quite bad communicator, use the menu to tell me exactly what you want!';
        sendTextMessage(senderID, messageText);
    }
}

function sendCourseRegistrationMessage(recipientId) {
    const messageData = {
        "recipient": {
            "id": recipientId
        },
        "message": courseButtonMessage
    };
    FacebookAPI.callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };
    FacebookAPI.callSendAPI(messageData);
}


module.exports = {
    receivedMessage: receivedMessage,
    sendTextMessage: sendTextMessage,
    receivedPostback: receivedPostback
};

const userAction = require('./model/userAction');


function receivedNotificationQuery(ID) {
    userAction.notifyArrival(ID);
}

function receivedUnsubscribeQuery(ID) {
    userAction.unsubscribe(ID, function () {
        const messageText = "You have Successfully unsubscribed from all your registered courses, you won't receive any notifications anymore and you won't be able to issue any further notifications!"
        sendTextMessage(ID, messageText);
    });
}

function receivedGetStarted(senderID) {
    FacebookAPI.callUserInfoAPI(senderID, function (err, info) {
        const messageText = 'Hi ' + info.first_name + ', start by clicking on the menu and subscribe to your registered courses!';
        sendTextMessage(senderID, messageText);
        userControl.addUser({firstName: info.first_name, lastName: info.last_name, ID: senderID, currentEvent: null});
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