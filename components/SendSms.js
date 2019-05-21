// // Download the helper library from https://www.twilio.com/docs/node/install
// // Your Account Sid and Auth Token from twilio.com/console
// // DANGER! This is insecure. See http://twil.io/secure
// const accountSid = 'AC343df4e7a5e0f0a78376db1f82bed4b5';
// const authToken = '77639c0ddc201787c548cb330230fefb';
// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//      from: '+15017122661',
//      to: '+15558675310'
//    })
//   .then(message => console.log(message.sid));