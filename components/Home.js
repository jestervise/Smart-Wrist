import React, { Component } from 'react';
import { 
  View, Text, StyleSheet,Alert,Animated,Linking
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import styles from '../Styles'
import firebase from './firebaseconfig';
import {createIconSetFromFontello} from '@expo/vector-icons';
import fontelloConfig from '../assets/config.json';
import { GradientHelper } from "./GradientHelper";
import {
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';
import { Settings } from './Settings';
import { Profile } from './Profile';
import { Feed } from './Feed';
import { Timer } from './Timer';
export let timerObject=[];
export const FonTelloIcon = createIconSetFromFontello(fontelloConfig, 'c');

export async function initializeFirebaseTimer() {
  let userId = firebase.auth().currentUser.uid;
  let firebaseUserRef = firebase.database().ref("users/" + userId);
  firebaseUserRef.on('value', function (snapshot) {
    //if(snapshot.val()!=undefined)
    console.log(snapshot.val());
    timerObject = snapshot.val() ? Object.entries(snapshot.val()) : [];
    console.log(timerObject);
  });
  return Promise.resolve("done")
}

export function setTimerObject(value){
    timerObject=value
}

class Home extends Component {
  constuctor (props){
    initializeFirebaseTimer();
  }
  render() {
    return <AppContainer />;
  }
}
export default Home;



// const AnimatedGradientHelper = Animated.createAnimatedComponent(GradientHelper)

const AnimatedGradientHelper = Animated.createAnimatedComponent(GradientHelper);

class AnimatedGradient extends Component {
  constructor(props) {
    super(props);

    const { colors } = props;
    this.state = {
      prevColors: colors,
      colors,
      tweener: new Animated.Value(0)
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { colors: prevColors } = state;
    const { colors } = props;
    const tweener = new Animated.Value(0);
    return {
      prevColors,
      colors,
      tweener
    };
  }

  componentDidUpdate() {
    const { tweener } = this.state;
    Animated.timing(tweener, {
      toValue: 1
    }).start();
  }

  render() {
    const { tweener, prevColors, colors } = this.state;

    const { style } = this.props;

    const color1Interp = tweener.interpolate({
      inputRange: [0, 1],
      outputRange: [prevColors[0], colors[0]]
    });

    const color2Interp = tweener.interpolate({
      inputRange: [0, 1],
      outputRange: [prevColors[1], colors[1]]
    });

    return (
      <AnimatedGradientHelper
        style={style || styles.component}
        color1={color1Interp}
        color2={color2Interp}
      />
    );
  }
}

const Detail = props => (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Detail</Text>
  </View>
);


//Navigation Options


const HomeStack = createStackNavigator(
  {
    Feed: {
      screen: Feed,
      navigationOptions: ({ navigation }) => {
        return {
          header:null,
          headerTitle:'Home',
          headerStyle:{
            marginBottom:'0%'
          },
          headerLeft: (
            <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
          ),
          headerRight:(
            <Icon name="md-log-out" size={34} color="#000" style={{paddingRight: 10,}} onPress={
              ()=>{
                Alert.alert("Alert","Are you sure?",
                [
                  {text: 'Yes',style:'default', onPress: () => {
                    firebase.auth().signOut().then(()=>{
                      let user=firebase.auth.currentUser;
                      if(user){
                        return "logged in"
                      }else{
                        return "logged out"
                      }
                    }).then((logged)=>{
                      if(logged=="logged out"){
                        console.log(logged);
                        navigation.navigate('ProfileStack');// Navigate ProfileStack
                      }
                    }).catch((error)=>console.log(error))
                  }},//Alert Button Yes
                  {text: 'No' ,style:'cancel'},//Alert Button No
                ]//AlertButton
                );
               
            }
            }/>
          )
        };
      }
    },
    Detail: {
      screen: Detail
    }
  },
  {
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);

const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => {
      return {
        header:null,
        headerTitle: 'Profile',
        headerLeft: (
          <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
});
const SettingsStack = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => {
      return {
        header:null,
        headerTitle: 'Settings',
        headerLeft: (
          <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
});

const TimerStack = createStackNavigator({
  Timer: {
    screen: Timer,
    navigationOptions: ({ navigation }) => {
      return {
        header:null,
        headerTitle: 'Timer',
        headerLeft: (
          <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
});

const DashboardTabNavigator = createBottomTabNavigator(
  {
    HomeStack,
    ProfileStack,
    TimerStack,
    SettingsStack,
    
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      
      return {
        
        header: null,
        headerTitle: routeName,
        
      };
    },
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: '#E9C59C',
      showLabel :false,
      style:{
        backgroundColor:"#FFEEDA"
      }
    },
    defaultNavigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      let iconName="md-home";
    
      if(routeName=="Feed")
        iconName="md-home"
      else if(routeName=="Settings")
        iconName="md-settings"  
      else if(routeName=="Profile")
        iconName="md-person"
      else if(routeName=="Timer")
        iconName="md-alarm"       
      return {
        tabBarIcon:({ focused, horizontal, tintColor })=>{return <Icon name={iconName} size ={32} color={tintColor}/>}
      };
    } 
  }
);
const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
);

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: DashboardStackNavigator
  }
  
});

const AppSwitchNavigator = createSwitchNavigator({
  
  Dashboard: { screen: AppDrawerNavigator }
});

const AppContainer = createAppContainer(AppSwitchNavigator);

