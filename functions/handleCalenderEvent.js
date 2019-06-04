import { Calendar } from 'expo';
import { AsyncStorage } from 'react-native'
import moment from 'moment'

export async function createCalenderEvent(year, month, day, hour, minute) {
  let id;
  //Reformat the time 
  hour < 10 ? hour = "0" + hour : hour;
  minute < 10 ? minutes = "0" + minute : minute;
  month < 10 ? month = "0" + month : month;
  //Get the calendar in your local device
  let calendars = await Calendar.getCalendarsAsync();
  let calendarId;
  calendarId = calendars[0].id;
  //Set the date to the date selected by user
  // let date = new Date(year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + "00");
  // let date = moment().format(year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + "00");
  let date = moment([year, month, day, hour, minute])
  //Create the alarm event on the specific calendar with the calendar id
  console.log(moment([year, month, day, hour, minute]));
  console.log("The date:" + year + " " + month + " " + day + " " + hour + " " + minute);
  // console.log(date.toDateString());

  try {
    var eventId = await Calendar.createEventAsync(calendarId,
      //Details of reminder
      {
        title: 'Smart Wrist: Take Pill',
        startDate: date,
        endDate: date,
        allDay: false,
        location: "Malaysia",
        notes: "Take pill",
        //Alert user through 
        alarms: [{ relativeOffset: 0, method: "alert" }],
        timeZone: 'GMT+8',
        accessLevel: 'owner'
      }).then((x) => {
        console.log("result:" + x);
        id = x;
        storeKeyValueReminder(x)
      }).catch((x) => { console.log("failure" + x); });
  }
  catch (error) {
    console.log(error);
  }

  return id;
}


async function storeKeyValueReminder(id) {
  try {
    console.log(id);
    await AsyncStorage.setItem(id.toString(), id.toString());
  } catch (error) {
    // Error saving data
    console.log("error saving:" + error)
  }
}

export function deleteCalendarEvent() {

}
