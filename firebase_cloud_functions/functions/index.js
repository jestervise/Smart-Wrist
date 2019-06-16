
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
const fetch = require('node-fetch')
admin.initializeApp();

const twilio = require('twilio');

// const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const accountSid = "AC343df4e7a5e0f0a78376db1f82bed4b5";
const authToken = "77639c0ddc201787c548cb330230fefb";

const client = new twilio(accountSid, authToken);

const twilioNumber = '+16122610175' // your twilio phone number

//Setup the credentials for accessing TwiML XML
// const crypto = require('crypto')
//     , request = require('request')

// const url = process.argv[2] + '?AccountSid=' + accountSid

// const twilioSig = crypto.createHmac('sha1', authToken).update(new Buffer(url, 'utf-8')).digest('Base64')

// request({url: url, headers: { 'X-TWILIO-SIGNATURE': twilioSig }}, function(err, res, body) {
//   console.log(body)
// })


/// start cloud function

exports.textStatus = functions.database
    .ref('/caregiverDetails/V6l3238f8oQzrgMmIWgTlhVcNI73/status')
    .onUpdate(event => {


        return admin.database()
            .ref(`/caregiverDetails/V6l3238f8oQzrgMmIWgTlhVcNI73`)
            .once('value')
            .then(snapshot => snapshot.val())
            .then(detectionStatus => {
                const status = detectionStatus.status
                const phoneNumber = detectionStatus.phoneNumber
                const shouldReceiveSMS = detectionStatus.shouldReceiveSMS
                const shouldReceiveCall = detectionStatus.shouldReceiveCall

                if (!validE164(phoneNumber)) {
                    throw new Error('number must be E164 format!')
                }

                if (shouldReceiveSMS === "false") {
                    throw new Error('the user expected no SMS!')
                }


                if (shouldReceiveCall === "false") {
                    throw new Error('the user expected no Call!')
                }

                const textMessage = {
                    body: `The condition of elderly: ${status}`,
                    to: phoneNumber,  // Text to this number
                    from: twilioNumber // From a valid Twilio number
                }

                const callMessage = {
                    method: 'POST',
                    statusCallBack: "https://postb.in/b/1560177355806-0404528579674",
                    statusCallbackEvent: ['queued', 'answered'],
                    statusCallbackMethod: 'GET',
                    url: 'http://demo.twilio.com/docs/voice.xml',
                    to: phoneNumber,  // Text to this number
                    from: twilioNumber // From a valid Twilio number
                }


                if (status === "fallDetectedSMS") {
                    return client.messages.create(textMessage)
                } else if (status === "fallDetectedCall") {
                    return makeCall(callMessage).then(call => {
                        return makeCallChoice(call)
                    }).catch(err => console.log(err))
                }

                throw new Error('no fall detected!')

            })
            .then(message => console.log(message.sid, 'success'))
            .catch(err => console.log(err + " eRRoR has occured"))


    });

exports.dailyScheduler = functions.runWith({ memory: '2GB' }).pubsub
    .schedule('* * * * *').onRun(async context => {
        return admin.database().ref(`users/V6l3238f8oQzrgMmIWgTlhVcNI73`)
            .once('value')
            .then(snapshot => {
                let newSnapshot = Object.entries(snapshot.val())
                return newSnapshot.forEach((reminderItem) => {
                    let date = reminderItem[1].date
                    let time = reminderItem[1].time
                    let dateTime = moment(date + " " + time, "D/M/YYYY HH:mm", 'ms')
                    if (moment(undefined, undefined, 'ms').add(8, 'hours').isSameOrAfter(dateTime)) {
                        sendPushNotification()
                        // console.log("did send " + dateTime.format("D/M/YYYY HH:mm"))
                        admin.database().ref(`users/V6l3238f8oQzrgMmIWgTlhVcNI73/` + reminderItem[0]).remove();
                    } else {
                        // console.log("didn't delete and send " +
                        //     dateTime.format("D/M/YYYY HH:mm") + "and the current time is"
                        //     + moment(undefined, undefined, 'ms').utcOffset(8).format("D/M/YYYY HH:mm"))
                    }
                })


            }
            )
            .catch((err) => console.log(err))
    })

function makeCallChoice(call) {
    if (call.status === "canceled") {
        return makeCall(call)
    } else {
        return console.log(call.status)
    }
}

async function sendPushNotification() {
    return await admin.database().ref('PushNotificationToken/V6l3238f8oQzrgMmIWgTlhVcNI73/push_token')
        .once('value')
        .then((snapshot) => {
            let userToken = snapshot.val();
            let response = fetch("https://exp.host/--/api/v2/push/send", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: userToken,
                    sound: 'default',
                    title: "Reminder",
                    body: 'Take pill'
                })
            })

            return response;

        }

        ).catch(err => { console.log(err) })

}

function makeCall(callMessage) {
    return client.calls.create(callMessage)
}


/// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}