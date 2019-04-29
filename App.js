import React from 'react';
import {View,TouchableWithoutFeedback,Keyboard } from 'react-native';
import styles from './Styles'
import {
  createSwitchNavigator,
  createAppContainer,
  createNavigator
} from 'react-navigation';
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from './Home'
import Login from './Login'
import DismissKeyboard from './DismissKeyboard';
import firebase from './firebaseconfig';
import {AppLoading} from 'expo'

//The main application to control subcomponent
export default class App extends React.Component {
  state={
    isReady:false
  };

  /*async loadFirebaseUserAsync(){
     return Promise( firebase.auth().onAuthStateChanged((user) => {
      if (user) {
         console.log("!!");
      }
    }))
     
  }*/
 
  render() {
    /*if(!this.state.isReady){
      return (
      <AppLoading onFinish={()=>this.setState({isReady:true})}
      onError={console.warn} startAsync={this.loadFirebaseUserAsync}/>
      )
    }*/
    return (
      <Provider store={store}>
      {/*<DismissKeyboard>*/}
      <View style={styles.container}>
          <AppSwitch/>
      </View>
      {/*</DismissKeyboard>*/}
      </Provider >  
      
    );
  }
}


 



 const AppSwitchNavigator=createSwitchNavigator({
    Login:Login,
    Home:Home,
  });


 

 const AppSwitch = createAppContainer(AppSwitchNavigator);
  




 
  
   





