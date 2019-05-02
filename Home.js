import React, { Component } from 'react';
import { 
  View, Text, StyleSheet,TextInput, Button,DatePickerAndroid,
  TimePickerAndroid,DatePickerIOS,Platform,ScrollView,
  TouchableOpacity,Image,ImageBackground,Dimensions,FlatList,Alert
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import styles from './Styles'
import {MiddleCircle,ProfileCircle} from './SvgShapes'
import firebase from './firebaseconfig';
import StepsCounter from './StepsCounter'
import Call from './Call'
import Modal from 'react-native-modal'
import {Calendar as RNCalendar} from 'react-native-calendars'
import {Permissions,Location,ImagePicker,Calendar} from 'expo'
import {Overlay,Button as RNButton} from 'react-native-elements'
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
      location:null
    }
     this.getLocationAsync = this.getLocationAsync.bind(this);
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

  componentWillMount(){
    this.getLocationAsync();
  }
  
  getLocationAsync = async ()=>{
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log("they passed through here");
    console.log(status);
    if(status!=='granted'){
      console.log(status);
    }
      
    
  }

  render() {
    return (
        <View style={{ flex: 1, backgroundColor:'#EFEBE6'}}>
        <View style={{position:'absolute', left:10,top:20,zIndex: 100,}}>
          <Icon style={{ paddingLeft: 10,paddingTop:20 }} onPress={() => this.props.navigation.openDrawer()} name="md-menu" size={30} color="#fff"/>
        </View>
        <View style={{position:'absolute', right:10,top:20,zIndex: 100,}}>
          {/* Sign Out Button */}
          <Icon name="md-log-out" size={30} color="#fff" style={{paddingRight: 10,paddingTop:20}} onPress={
                ()=>{
                  Alert.alert("Sign Out","Are you sure?",
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
        </View>
        <ScrollView keyboardShouldPersistTaps="never">
          <ImageBackground resizeMode='contain' style={{flex:1,flexDirection:'column',justifyContent:'space-between',alignItems:'center',width:'100%',height:height*(64/100),marginBottom: '5%',marginTop:0,paddingTop:0,top:-20}}source={require("./assets/dashboardBackground.png")}>
          
            <MiddleCircle />
            <Call />
          <TouchableOpacity  style={{flex:0.1,marginBottom:20}} onPress={() => this.props.navigation.navigate('Detail')}>
          <Text style={{color:'#fff'}}>More Details <Icon name="md-arrow-dropdown" size={18} color="#fff"/></Text>
          </TouchableOpacity>
          </ImageBackground>
          {/* <Button title="Go To Detail Screen" onPress={() => this.props.navigation.navigate('Detail')} /> */}
          <DashBoardButton iconLocation={require("./assets/AddTimerIcon.png")} text={{header:"Add Timer",desc:'Remind you to eat medicine'}} func={this.AddTimer} rightButton="md-add-circle-outline"/>
          {this.state.isIOS && <Modal>
            <View>
            <DatePickerIOS date={this.state.chosenDate} onDateChange={(newDate)=>{ this.setState({chosenDate: newDate});}}
          /></View>
          </Modal>
          }
          
          <DashBoardButton iconLocation={require("./assets/AddTimerIcon.png")} text={{header:"Movement Report",desc:'Check your movement'}} func={this.AddTimer} rightButton="md-add-circle-outline"/>
          
          {
            this.state.isIOS && <Button title="Submit" onPress={()=>
              {this.props.navigation.navigate('TimerStack',{year:year,month:month,day:day});}}/>
          }  

          <Button title="PlacehodlerButton" onPress={() => this.props.navigation.navigate('Detail')} />
        </ScrollView>
        <StepsCounter />
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
  constructor(props){
    super(props);
    this.state={
      location:null,
      displayName:firebase.auth().currentUser.displayName==undefined?
      firebase.auth().currentUser.email:firebase.auth().currentUser.displayName,
      editable:false,
      image:require("./assets/placeholderProfilePic.png"),
      isVisible:false
    }

    this.textInput = React.createRef();
  }
  
  componentWillMount(){
    this.getLocationAsync();
  }
  async getLocationAsync(){
    let location = await Location.getCurrentPositionAsync({});
      let locationAddress =await Location.reverseGeocodeAsync({latitude:location.coords.latitude,longitude:location.coords.longitude});
      this.setState({location:locationAddress});
    
  }

  ChangeDisplayName(){
    this.setState({editable:true});
    this.textInput.current.focus();
  }

  SaveDisplayName(){
    this.setState({editable:false});
    firebase.auth().currentUser.updateProfile({
      displayName:this.state.displayName
    }).then(()=> console.log(firebase.auth().currentUser.displayName));

  }

  OpenCalender(){
    console.log("Open Calender method")
    this.setState({isVisible:true});
  }

  async ChoosePhotoAsync(){
    console.log("ChoosePhoto method")
    if(Platform.OS=='ios'){
      Permissions.askAsync(Permissions.CAMERA_ROLL).then(()=>
      ImagePicker.launchImageLibraryAsync({mediaTypes:'Images',allowsEditing:true})
      );
    }else{
      let result=await ImagePicker.launchImageLibraryAsync({mediaTypes:'Images'});
      console.log(result.uri);
      if(!result.cancelled){
        
        this.setState({image:{uri:result.uri}});
        console.log(this.state.image)

      }
         
    }
  }

  render() {
    let location="Loading";
    let  image  = this.state.image;
    if(this.state.location){
      location = this.state.location[0].region+","+this.state.location[0].country
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Overlay isVisible={this.state.isVisible} style={{flex:1,justifyContent:'space-between'}}>
      <Text style={{fontWeight:'bold',fontSize:20,textAlign:'center'}}>Calender</Text>
      
      <RNCalendar/>
      <RNButton title="CLOSE" onPress={()=>this.setState({isVisible:false})}/>
      </Overlay>
       <ImageBackground source={this.state.image} 
       style={{top:0,width:'100%',position:'absolute',height:height*0.4}}>
       <View style={{flexDirection:'row',justifyContent:'space-between',paddingTop:20}}>
          <CalenderComponent OpenCalender={this.OpenCalender.bind(this)}/>
          <EditBanner ChoosePhoto={this.ChoosePhotoAsync.bind(this)}/>
       </View>
       <ProfileCircle/>
       </ImageBackground>
       {/* username and location tag */}
        <View style={{top:'5%',marginTop:'5%',left:'10%',width:"65%"}}>
          <View style={{flexDirection:'row'}}>
            <TextInput ref={this.textInput} value={this.state.displayName} editable={this.state.editable} onSubmitEditing={this.SaveDisplayName.bind(this)}
             onChangeText={(text)=>this.setState({displayName:text})} style={{color:"#F68909",fontSize:15,textAlign:"left",fontWeight:'bold'}}/>
            <EditUserName ChangeDisplayName={this.ChangeDisplayName.bind(this)}/>
          </View>
          <View style={{flexDirection:'row',paddingTop:5}}>
            <Icon name="md-pin" size={12} color="#FF5353" />
          <Text style={{paddingLeft:10,color:'#FF5353',fontSize:12,textAlign:'left'}}>{location}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const EditBanner=(props)=>{return <TouchableOpacity onPress={props.ChoosePhoto}>
<Icon name="md-create" size={23} color="#FFAEAE" style={{paddingRight:20,paddingTop:20}}/>
</TouchableOpacity>}
const CalenderComponent =(props)=> {return <TouchableOpacity onPress={props.OpenCalender}>
<Icon name="md-calendar" size={25} color="#FFAEAE" style={{paddingLeft:20,paddingTop:20}}/>
</TouchableOpacity>}

const EditUserName=(props)=>{
  return <TouchableOpacity onPress={props.ChangeDisplayName}>
        <Icon name="md-create" size={15} color="#FF5353" style={{paddingLeft:10}}/>
    </TouchableOpacity>
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
        <Icon name="md-copy" size={200} color="#FF5A5A"/>
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

