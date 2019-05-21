import { DatePickerAndroid, TimePickerAndroid, Platform } from 'react-native';
import firebase from '../components/firebaseconfig';
import { Permissions } from 'expo';
import { createCalenderEvent } from "./handleCalenderEvent";
import { writeUserData } from "./writeUserData";

export async function AddTimer() {
  //Ask for reminder permission in IOS
  if (Platform.OS == 'android') {
    //Date Picker
    const { action, year, month, day } = await DatePickerAndroid.open();
    if (action !== DatePickerAndroid.dismissedAction) {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        is24Hour: false,
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        var uid = firebase.auth().currentUser.uid;
        var remindersPermission = await Permissions.askAsync(Permissions.CALENDAR);
        if (remindersPermission.status == "granted") {
          createCalenderEvent(year, month + 1, day, hour, minute);
        }
        let done = await writeUserData(uid, day, month + 1, year, hour, minute);
        if (done == "done") {
          return "done";
        }
      }
    }
  }
}

