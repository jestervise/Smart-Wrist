import RNCalenderReminders from 'react-native-calendar-reminders'

RNCalenderReminders.authorizeEventStore((error, auth) => {
    console.log('authorizing EventStore...');
  });