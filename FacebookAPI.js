const request = require('request');

module.exports = {
    callSendAPI : function (messageData) {
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
    },
    callUserInfoAPI: function (senderID, callback) {
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
};

