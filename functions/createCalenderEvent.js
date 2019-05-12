import { Calendar } from 'expo';
export async function createCalenderEvent(year, month, day, hour, minute) {
  //Reformat the time 
  hour < 10 ? hour = "0" + hour : hour;
  minute < 10 ? minutes = "0" + minute : minute;
  month < 10 ? month = "0" + month : month;
  //Get the calendar in your local device
  let calendars = await Calendar.getCalendarsAsync();
  let calendarId;
  calendarId = calendars[0].id;
  //Set the date to the date selected by user
  let date = new Date(year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + "00");
  //Offset the hour to gmt -8 to counter the gmt+8 setting in android
  date.setHours(date.getHours() /*- 8*/);
  //Create the alarm event on the specific calendar with the calendar id
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
        timeZone: "GMT+0",
        accessLevel: 'owner'
      }).then((x) => { console.log("result:" + x); }).catch((x) => { console.log("failure" + x); });
  }
  catch (error) {
    console.log(error);
  }
}
