import React, { Component } from 'react';
import { 
  View, Text, StyleSheet, Button,DatePickerAndroid,
  TimePickerAndroid,DatePickerIOS,Platform,ScrollView,
  TouchableOpacity,Image,ImageBackground,Dimensions,FlatList,Alert
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import styles from './Styles'
import {MiddleCircle} from './SvgShapes'
import firebase from './firebaseconfig';
var { height, width } = Dimensions.get("window");
/**
 * - AppSwitchNavigator
 *    - WelcomeScreen
 *      - Login Button
 *      - Sign Up Button
 *    - AppDrawerNavigator
 *          - Dashboard - DashboardStackNavigator(needed for header and to change the header based on the                     tab)
 *            - DashboardTabNavigator
 *              - Tab 1 - FeedStack
 *              - Tab 2 - ProfileStack
 *              - Tab 3 - SettingsStack
 *            - Any files you don't want to be a part of the Tab Navigator can go here.
 */

import {
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';
import store from "./redux/store"
let timerObject=[];

async function writeUserData(userId,day,month,year,hour,minutes) {
  
  let firebaseUserRef=firebase.database().ref("users/"+userId);
  firebaseUserRef.on('child_added',function (snapshot){
    let counter =0;
    let tempObj={};
    snapshot.forEach(childSnapshot=>{
      if(counter ==0){
        tempObj['date']=childSnapshot.val();
        counter++
      }else if(counter ==1){
        tempObj['time']=childSnapshot.val();
        timerObject.push(tempObj);
        tempObj={};
        counter=0;
      }
      
    })
    console.log(timerObject);
  });
  
  let newTimerRef=firebaseUserRef.push();
    newTimerRef.set({
      date: day+"/"+month+"/"+year,
      time:(hour<10?"0"+hour:hour )+":"+(minutes<10?"0"+minutes:minutes )
  });
  

  

}




class Home extends Component {

  render() {
    return <AppContainer />;
  }
}
export default Home;



class DashboardScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>DashboardScreen</Text>
      </View>
    );
  }
}

class Feed extends Component {
  constructor(props){
    super(props);
    this.AddTimer= this.AddTimer.bind(this);
    this.state={
      isIOS:false,
      chosenDate: new Date(),

    }
  
  }



  async AddTimer(){
    
    
  if(Platform.OS=='android'){
    //Date Picker
    const {action, year, month, day}= await DatePickerAndroid.open();
   
    if (action !== DatePickerAndroid.dismissedAction) {
      const { action ,hour, minute} = await TimePickerAndroid.open({
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        is24Hour: false, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction){
        var uid = firebase.auth().currentUser.uid;
        writeUserData(uid,day,month,year,hour,minute).then(
          ()=>this.props.navigation.navigate('TimerStack')
        );
        
      }
        
    }
    

  }else{
    this.setState({
      isIOS:true
    })
  }
    
  }

  componentDidMount(){
    
  }
  

  render() {
    return (
        <View style={{ flex: 1, backgroundColor:'#EFEBE6' }}>
        <ScrollView keyboardShouldPersistTaps="never" >
          <ImageBackground resizeMode='contain' style={{flex:1,flexDirection:'column',justifyContent:'space-between',alignItems:'center',width:'100%',height:height*(64/100),marginBottom: '5%',marginTop:0,paddingTop:0}}source={require("./assets/dashboardBackground.png")}>
            
            <MiddleCircle />
          <Icon name="md-call" size={18} color="#fff" style={{position:'relative',alignSelf:'flex-end',right:"20%"}}/>
           
          <TouchableOpacity  style={{flex:0.1,}} onPress={() => this.props.navigation.navigate('Detail')}>
          <Text style={{color:'#fff',marginBottom:20}}>More Details <Icon name="md-arrow-dropdown" size={18} color="#fff"/></Text>
          </TouchableOpacity>
          </ImageBackground>
          {/* <Button title="Go To Detail Screen" onPress={() => this.props.navigation.navigate('Detail')} /> */}
          <DashBoardButton iconLocation={require("./assets/AddTimerIcon.png")} text={{header:"Add Timer",desc:'Remind you to eat medicine'}} func={this.AddTimer} rightButton="md-add-circle-outline"/>
          {this.state.isIOS && <View>
            <DatePickerIOS date={this.state.chosenDate} onDateChange={(newDate)=>{ this.setState({chosenDate: newDate});}}
          /></View>}
          <DashBoardButton iconLocation={require("./assets/AddTimerIcon.png")} text={{header:"Movement Report",desc:'Check your movement'}} func={this.AddTimer} rightButton="md-add-circle-outline"/>
          
          {
            this.state.isIOS && <Button title="Submit" onPress={()=>
              {this.props.navigation.navigate('TimerStack',{year:year,month:month,day:day});}}/>
          }  

          <Button title="PlacehodlerButton" onPress={() => this.props.navigation.navigate('Detail')} />
        </ScrollView>
        
      </View>
    );
  }

    
}

class DashBoardButton extends Component{
  render(){
    return <View style={styles.dashboardButtonStyle}>
      <Image source={this.props.iconLocation} resizeMode='contain' style={{ width: 118.56, height: 102.6, flex: 1 }} />
      <View style={{ margin: 5, width: '35%' }}>
        <Text style={{ fontWeight: 'bold' }}>{this.props.text.header}</Text>
        <Text style={styles.dashboardTextStyle}>{this.props.text.desc}</Text>
      </View>
      <TouchableOpacity onPress={this.props.func}>
        <Icon name={this.props.rightButton} size={34} color="#FF5A5A" />
      </TouchableOpacity>
    </View>;
  }
  
}


class Settings extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
        <ImageBackground source={require("./assets/settings_background.png")} style={{width:'100%',height:'100%'}}>
        <Icon name="md-settings" size={34} color="#fff" style={{alignSelf:'flex-end',margin:10}}/>
        <ScrollView>
          <Image source={require("./assets/bubble.png")} style={{marginLeft:20,marginBottom:5}}/>
          <SettingsObject/>
          <SettingsObject/>
          <SettingsObject/>
          <SettingsObject/>
          <SettingsObject/>
          <SettingsObject/>
        </ScrollView>
       </ImageBackground>
      
        
      </View>
    );
  }

 
}

const SettingsObject=()=> {
  return <View style={{ backgroundColor: '#FF5858', marginLeft: 10, marginRight: 10, marginBottom:2,height: 50, flexDirection: 'row',elevation:3 }}>
    <Text style={{ color: '#fff', alignSelf: 'center', paddingLeft: 20 }}>Color!!</Text>
  </View>;
}

class Profile extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Profile</Text>
      </View>
    );
  }
}

class Timer extends Component {
  constructor(props){
    super(props);
   
    this.state={
      renderText:timerObject,
    }
  }
  
  comp

  DeleteTimer(){

  }

  render() {
    const itemId = this.props.navigation.getParam('day', 'NO-ID');
    const otherParam = this.props.navigation.getParam('year', 'some default value');

    console.log(itemId +otherParam);
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Timer</Text>
        <Text>{itemId +" "+otherParam}</Text>
        { this.state.renderText.length!=0 && 
        <View>
          <MultiSelectList data={timerObject} DeleteTimer={this.props.DeleteTimer}/>
        </View>}
         {console.log(this.state.renderText)}
      </View>
    );
  }
}

class MultiSelectList extends React.PureComponent {
  state = {selected: new Map()};

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      date={item.date}
      time={item.time}
      DeleteTimer={this.props.DeleteTimer}
    />
  );

  render() {
      console.log(this.props.data);
    return (
     
      <FlatList
        data={this.props.data}
        extraData={timerObject}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
     
    );
  }
}

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}>
        <DashBoardButton iconLocation={require("./assets/AddTimerIcon.png")} text={{header:this.props.date,desc:this.props.time}} func={this.props.DeleteTimer} rightButton="md-close-circle-outline"/>
      </TouchableOpacity>
    );
  }
}

const Detail = props => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Detail</Text>
  </View>
);

const HomeStack = createStackNavigator(
  {
    Feed: {
      screen: Feed,
      navigationOptions: ({ navigation }) => {
        return {
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

