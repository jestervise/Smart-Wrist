import firebase from '../components/firebaseconfig'
import React from 'react'
import {Alert} from 'react-native'


export function signOutPopUp(popOut) {

    Alert.alert("Sign Out", "Are you sure?", [
      {
        text: 'Yes', style: 'default', onPress: ()=>{signOut(popOut)}
      },
      { text: 'No', style: 'cancel' },
    ]);

}

function signOut(popOut) {
   
  firebase.auth().signOut().then(() => {
    let user = firebase.auth.currentUser;
    if (user) {
      return "logged in";
    }
    else {
      return "logged out";

    }
  }).then((logged) => {
    if (logged == "logged out") {
      console.log(logged);
       // Navigate to login screen
       popOut.navigate("Login");
    }
  }).catch((error) => console.log(error));
};
