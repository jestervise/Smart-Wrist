
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
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

function makeCallChoice(call) {
    if (call.status === "canceled") {
        return makeCall(callMessage)
    } else {
        return console.log(call.status)
    }
}

function makeCall(callMessage) {
    return client.calls.create(callMessage)
}


/// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}