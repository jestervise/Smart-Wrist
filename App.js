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
import Home from './components/Home'
import Login from './components/Login'
import DismissKeyboard from './components/DismissKeyboard';
import firebase from './components/firebaseconfig';
import {AppLoading} from 'expo'
import SplashScren from './components/SplashScreen'

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
  




 
  
   





