import React from 'react';
import {View,TouchableWithoutFeedback,Keyboard } from 'react-native';
import styles from './Styles'
import {
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from './Home'
import Login from './Login'
import DismissKeyboard from './DismissKeyboard';


//The main application to control subcomponent
export default class App extends React.Component {
  
 
  render() {
    //let userName='mj@gmailCom';
    //this.readUserData(userName);
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


const AppSwitchNavigator = createSwitchNavigator({
  Login:{
    screen: Login
  },
  Home:{
    screen: Home
  }
});

const AppSwitch = createAppContainer(AppSwitchNavigator);


