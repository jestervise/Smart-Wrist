import firebase from '../components/firebaseconfig';
import { timerObject } from '../components/Home';
import { initializeFirebaseTimer,setTimerObject } from "../components/Home";
export async function writeUserData(userId, day, month, year, hour, minutes) {
  setTimerObject([]);
  let firebaseUserRef = firebase.database().ref("users/" + userId);
  initializeFirebaseTimer();
  let newTimerRef = firebaseUserRef.push();
  newTimerRef.set({
    date: day + "/" + month + "/" + year,
    time: (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? "0" + minutes : minutes)
  });
  return Promise.resolve("done");
}
