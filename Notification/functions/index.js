'use strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('/notifications/{receiver_user_id}/{Notification_id}')
    .onWrite((data, context) => {
        const receiver_user_id = context.params.receiver_user_id;
        const Notification_id = context.params.Notification_id;

        console.log('We have a notification to send to: ', receiver_user_id);

        if (!data.after.val()) {
            console.log('A notification has been deleted ', Notification_id);
            return null;
        }


        const sender_user_id = admin.database().ref(`/Notifications/${receiver_user_id}/${Notification_id}`).once('value');

        return sender_user_id.then(fromUserResults => {
            const from_sender_user_id = fromUserResults.val().from;

            console.log('you have a notification from :', sender_user_id);

            const userQuery = admin.database().ref(`/Users/${receiver_user_id}/${device_token}`).once('value');

            return userQuery.then(userResults => {
                const senderUserName = userResults.val();
            });

            const DeviceToken = admin.database().ref(`/Users/${receiver_user_id}/device_token`).once('value');

            return DeviceToken.then(result => {
                const token_id = result.val();

                const payload = {
                    notification: 
                    {
                        from_sender_user_id : from_sender_user_id,
                        title: "New Chat Request",
                        body: `${senderUserName} wants to connect with you.`,
                        icon: "default"
                    }
                };

                return admin.messaging().sendToDevice(token_id, payload)
                    .then(response => {
                        console.log('This was a notifiction feature');
                    });
            });
        });
    });