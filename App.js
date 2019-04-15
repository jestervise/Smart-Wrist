import React from 'react';
import { StyleSheet, Text, View,ScrollView,TouchableHighlight,Alert,Button } from 'react-native';
import styles from './Styles'
import {Auth} from './Login'


//The main application to control subcomponent
export default class App extends React.Component {
 
  
  render() {
    return (
      <View style={styles.container}>
        <Auth />
      </View>  
    );
  }
}

