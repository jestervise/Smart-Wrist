import React, { Component } from 'react';
import { 
  View, Text, StyleSheet,TextInput, Button,DatePickerAndroid,
  TimePickerAndroid,DatePickerIOS,Platform,ScrollView,
  TouchableOpacity,TouchableNativeFeedback,Image,ImageBackground,Dimensions,FlatList,Alert,Animated,Easing,
  Linking
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import styles from '../Styles'
import {MiddleCircle,ProfileCircle,TimerCircle} from './SvgShapes'
import firebase from './firebaseconfig';

import StepsCounter from './StepsCounter'
import Call from './Call'
import Modal from 'react-native-modal'
import {Calendar as RNCalendar} from 'react-native-calendars'
import {Permissions,Location,ImagePicker,Calendar,LinearGradient,Font,IntentLauncherAndroid as IntentLauncher,Notifications} from 'expo'
import {Overlay,Button as RNButton} from 'react-native-elements'
import {createIconSetFromFontello} from '@expo/vector-icons';
import fontelloConfig from '../assets/config.json';
const FonTelloIcon = createIconSetFromFontello(fontelloConfig, 'c');
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
import store from "../redux/store"
let timerObject=[];

function initializeFirebaseTimer(){
  let userId=firebase.auth().currentUser.uid;
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
    //console.log(timerObject);
  });
}

async function writeUserData(userId,day,month,year,hour,minutes) {
  timerObject=[];
  let firebaseUserRef=firebase.database().ref("users/"+userId);
  initializeFirebaseTimer();
  let newTimerRef=firebaseUserRef.push();
    newTimerRef.set({
      date: day+"/"+month+"/"+year,
      time:(hour<10?"0"+hour:hour )+":"+(minutes<10?"0"+minutes:minutes )
  });
  

  

}

async function AddTimer(){
  //Ask for reminder permission in IOS
 
  
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
        var remindersPermission=await Permissions.askAsync(Permissions.CALENDAR);
          if(remindersPermission.status=="granted"){
            createCalenderEvent(year,month,day,hour,minute)
          }
       
        writeUserData(uid,day,month,year,hour,minute);
        
    }



  }
}
}

async function createCalenderEvent(year,month,day,hour,minute){
  hour<10?hour="0"+hour:hour;
  minute<10?minutes="0"+minute:minute
  month<10?month="0"+month:month

  let createCalenderPromise=await Calendar.createCalendarAsync({title:"Calendar",color:"red",
  source:{name:"blahblahblah",isLocalAccount:true},
  name:"csc",
  ownerAccount:"thissa"
  })

  console.log(createCalenderPromise);

  try{
    if(createCalenderPromise)
    Calendar.createEventAsync(createCalenderPromise, 
      //Details of reminder
      {title:'Reminder',
      startDate: new Date(year+"-"+month+"-"+day+"T"+hour+":"+minute+":"+"00"),
      endDate: new Date(year+"-"+month+"-"+day+"T"+hour+":"+minute+":"+"00"),
      allDay:false,
      location:"house",
      notes:"Take pill",
      alarms:[{relativeOffset:"-2",method:Calendar.AlarmMethod.ALARM}],
      timeZone:"GMT+8"
  })
  }catch(error){
    console.log(error)
  }
   
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
      location:null,
      iconColor:"#fff"
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

  componentDidMount(){
    //Linking.openURL(`tel:${"0123456789"}`);
  }

  handleScroll=(event)=>{
    if(event.nativeEvent.contentOffset.y>240)
      this.setState({iconColor:'#000'})
    else if(event.nativeEvent.contentOffset.y<10){
      this.setState({iconColor:'#fff'})
      console.log("pop")
    }
    else  
      this.setState({iconColor:'#fff'})
  }

  render() {
    return (
        <View style={{ flex: 1, backgroundColor:'#EFEBE6'}}>
        <View style={{position:'absolute', left:10,top:20,zIndex: 100,}}>
          <Icon style={{ paddingLeft: 10,paddingTop:20 }} onPress={() => this.props.navigation.openDrawer()} name="md-menu" size={30} color={this.state.iconColor}/>
        </View>
        <View style={{position:'absolute', right:10,top:20,zIndex: 100,}}>
          {/* Sign Out Button */}
          <Icon name="md-log-out" size={30} color={this.state.iconColor} style={{paddingRight: 10,paddingTop:20}} onPress={
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
        <ScrollView keyboardShouldPersistTaps="never" onScroll={this.handleScroll}>
          <ImageBackground resizeMode='contain' style={{flex:1,flexDirection:'column',justifyContent:'space-between',alignItems:'center',width:'100%',height:height*(64/100),marginBottom: '5%',marginTop:0,paddingTop:0,top:-20}}source={require("../assets/dashboardBackground.png")}>
          
            <MiddleCircle />
            <Call />
          <TouchableOpacity  style={{flex:0.1,marginBottom:20}} onPress={() => this.props.navigation.navigate('Detail')}>
          <Text style={{color:'#fff'}}>More Details <Icon name="md-arrow-dropdown" size={18} color="#fff"/></Text>
          </TouchableOpacity>
          </ImageBackground>
          {/* <Button title="Go To Detail Screen" onPress={() => this.props.navigation.navigate('Detail')} /> */}
          <DashBoardButton iconLocation={require("../assets/AddTimerIcon.png")} text={{header:"Add Timer",desc:'Remind you to eat medicine'}} func={this.AddTimer} rightButton="md-add-circle-outline"/>
          {this.state.isIOS && <Modal>
            <View>
            <DatePickerIOS date={this.state.chosenDate} onDateChange={(newDate)=>{ this.setState({chosenDate: newDate});}}
          /></View>
          </Modal>
          }
          
          <DashBoardButton iconLocation={require("../assets/AddTimerIcon.png")} text={{header:"Movement Report",desc:'Check your movement'}} func={this.AddTimer} rightButton="md-add-circle-outline"/>
          
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
      
        <ImageBackground source={require("../assets/settings_background.png")} style={{width:'100%',height:'100%'}}>
        <Icon name="md-settings" size={34} color="#fff" style={{alignSelf:'flex-end',margin:10,paddingTop:40}}/>
        <ScrollView>
          <Image source={require("../assets/bubble.png")} style={{marginLeft:20,marginBottom:5}}/>
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
  headerImage=function(){
    return firebase.storage().ref().child("images/profileImage"+firebase.auth().currentUser.uid)
  }

  
  constructor(props){
    super(props);
    this.state={
      location:null,
      displayName:firebase.auth().currentUser.displayName==undefined?
      firebase.auth().currentUser.email:firebase.auth().currentUser.displayName,
      editable:false,
      image:require("../assets/placeholderProfilePic.png"),
      isVisible:false,
      showPhotoSelection:false
    }
    
    this.textInput = React.createRef();
    this.ChooseFromGalleryAsync= this.ChooseFromGalleryAsync.bind(this)
    this.TakePhotoAsync = this.TakePhotoAsync.bind(this)
    
  }
  
  componentWillMount(){
    this.initializeHeaderImage();
    this.getLocationAsync();
  }

  async initializeHeaderImage(){
    //when component mount, download image from firebase storage and set it profile header
    const url =await this.headerImage().getDownloadURL();
    console.log(url)
    if(url)
      this.setState({image:{uri:url}})
  }

  async getLocationAsync(){
      //If location services is enabled
      let enabled=await Location.hasServicesEnabledAsync();
      if(enabled){
        //get current location 
        let location = await Location.getCurrentPositionAsync({});
        let locationAddress =await Location.reverseGeocodeAsync({latitude:location.coords.latitude,longitude:location.coords.longitude});
        this.setState({location:locationAddress});
      }else{
        //If no location enabled, navigate user location settings to enable
        Alert.alert("Reminder","Please Turn On The Location Services",
        [{text: 'OK', onPress: async () => {
          let x=await IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS)
        //If done, observe user location, and when location changed,reset user location
          if(x)
          Location.watchPositionAsync({},async (location)=>{
            console.log(location)
            let locationAddress =await Location.reverseGeocodeAsync({latitude:location.coords.latitude,longitude:location.coords.longitude});
            this.setState({location:locationAddress});
          })
          }
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        }]
        )

      }
      
    
  
  }
  
  //When change display name button is clicked,make the username editable and focus username
  ChangeDisplayName(){
    this.setState({editable:true});
    this.textInput.current.focus();
  }

  //if submit on click,make it ineditable and update the specific user's display name
  SaveDisplayName(){
    this.setState({editable:false});
    firebase.auth().currentUser.updateProfile({
      displayName:this.state.displayName
    }).then(()=> console.log(firebase.auth().currentUser.displayName));

  }

  //when open calendar's button on click, turn the overlay popup visibility on and show calendar
  OpenCalender(){
    console.log("Open Calender method")
    this.setState({isVisible:true});
  }

  //when profile header button on click, turn the overlay popup visibility on and show "take photo",
  //"choose from gallery" options
  ChoosePhoto(){
     this.setState({showPhotoSelection:true})      
  }
  
  //If "take photo option is selected"
  async TakePhotoAsync(){
    console.log("Take Photo method")
    
    //Ask for camera permissions
    let persmissions= await Permissions.askAsync(Permissions.CAMERA);
    //When it grants the permission, launch camera and hide choosePhotoSelection popup
    if(persmissions.status=="granted")
      var result=await ImagePicker.launchCameraAsync();
      this.setState({showPhotoSelection:false});
      //Then upload to firebase storage
      if(!result.cancelled)
          this.UploadToStorage(result.uri);
    
  }

  //If "choose from gallery option is selected"
  async ChooseFromGalleryAsync(){
    console.log("Gallery method")
    if(Platform.OS=='ios'){
      Permissions.askAsync(Permissions.CAMERA_ROLL).then(()=>
      ImagePicker.launchImageLibraryAsync({mediaTypes:'Images',allowsEditing:true})
      );
    }else{
      let result = await ImagePicker.launchImageLibraryAsync({mediaTypes:'Images'})
      this.setState({showPhotoSelection:false})
      if(!result.cancelled)
        this.UploadToStorage(result.uri);
  
     }
  }

  //Establish connection to local storage,Set the header image to selected photo, and upload the image
  async UploadToStorage(uri){
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
     
   
    this.setState({image:{uri:uri}});
    let snapshot=await this.headerImage().put(blob)
    
    
    blob.close();
  }
  

  render() {
    let location="Loading";
    let  image  = this.state.image;
    //Format the location data to state and country
    if(this.state.location){
      location = this.state.location[0].region+","+this.state.location[0].country
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* Calendar Pop Up */}
      <Overlay onBackdropPress={()=>{this.setState({isVisible:false})}} isVisible={this.state.isVisible} style={{flex:1,justifyContent:'space-between'}}>
      <Text style={{fontWeight:'bold',fontSize:20,textAlign:'center'}}>Calender</Text>
      
        <RNCalendar/>
        <RNButton title="CLOSE" onPress={()=>this.setState({isVisible:false})}/>
      </Overlay>
      {/* Choose From Gallery or Take Picture */}
      <Overlay onBackdropPress={()=>{this.setState({showPhotoSelection:false})}} isVisible={this.state.showPhotoSelection} height="20%" style={{flex:1,justifyContent:'space-around',alignItems: 'center',}}>
        <TouchableOpacity style={{flex:1,alignItems:'center'}} onPress={this.TakePhotoAsync}>
          <Text style={{fontSize:17}}>Take a Photo</Text>
          
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1,alignItems:'center'}} onPress={this.ChooseFromGalleryAsync}>
          <Text style={{fontSize:17}}>Choose From Gallery</Text>
        </TouchableOpacity>
      </Overlay>
      {/* Header Picture */}
       <ImageBackground source={this.state.image} 
       style={{top:0,width:'100%',position:'absolute',height:height*0.4}}>
       <View style={{flexDirection:'row',justifyContent:'space-between',paddingTop:20}}>
          <CalenderComponent OpenCalender={this.OpenCalender.bind(this)}/>
          <EditBanner ChoosePhoto={this.ChoosePhoto.bind(this)}/>
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

//Profile's Function Component/Icons in Profile page
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
    initializeFirebaseTimer();
    this.state={
      renderText:timerObject,
      fontLoaded:false,
      showButton:true,
      endAnim:false,
      killButton:false,
      checkOutButtonProgress: new Animated.Value(0)
    }

    this.AddTimer=this.AddTimer.bind(this);
  }
  
  comp

  DeleteTimer(){

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
          this.AddAlarmAnimation().then(writeUserData(uid,day,month,year,hour,minute))
          
        }
          
      }
      
  
    }  
  }

  async AddAlarmAnimation(){
    console.log("go through here");
    this.setState({showButton:false});
    return await Animated.timing(this.state.checkOutButtonProgress,{
      toValue:1,
      duration:1500,
      easing:Easing.linear,
      delay:500
    }).start(()=>{this.setState({showButton:true,killButton:true})
  })
  }

  async componentDidMount() {
    Font.loadAsync({
      "c": require('../assets/fonts/c.ttf')
    }).then(()=>this.setState({fontLoaded: true}));

    
  }

  render() {


    return (
      

      <LinearGradient  colors={['#FA9014', '#FF5050']} style={{  flex: 1,  justifyContent: 'center'}} >
        <TimerCircle />
        <View style={{flex:0.2,alignItems:'flex-start',padding:40,}}>
         <View>
            <Text>This is top quote</Text>
          </View>
        </View>
        <View style={{flex:0.8,justifyContent:'flex-start',alignItems:'center',flexDirection:'column',height:'100%'}}>
        {/* Alarm Card */}
         {this.state.renderText.length!=0? 
         <MultiSelectList data={timerObject} style={{justifyContent: 'center',alignItems:'center'}} DeleteTimer={this.props.DeleteTimer}/>:
          this.state.fontLoaded?
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white',margin: '10%',width:width*0.8,borderRadius:20,elevation:20}}>
            {this.state.showButton && !this.state.killButton && < TouchableOpacity  onPress={this.AddTimer}>
               <FonTelloIcon size={100} name="plus-circled" color="#FF5050" />
             </ TouchableOpacity >
            }
             {!this.state.showButton && <LottieView source={require("../assets/check_mark_success.json")} progress={this.state.checkOutButtonProgress}/>} 
          </View>:
          null
          
        }
          
        </View>
        
         {/* {console.log(this.state.renderText)} */}
         </LinearGradient>
  
    
    );
  }
}

class MultiSelectList extends React.PureComponent {
  state = {selected: new Map()};
  _keyExtractor = (item, index) =>item.id;

 

  _onPressItem = (id) => {
    console.log(id)
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
    AddTimer();
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
  )

  render() {
      console.log(timerObject);
    return (
      <FlatList
        data={this.props.data}
        extraData={timerObject}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        horizontal={true}
        vertical={false}
        ListFooterComponent={<FooterComponent _onPressItem={this._onPressItem}/>}
        showsHorizontalScrollIndicator={false}
      />
     
    );
  }
}

const FooterComponent=(props)=>{

    return < TouchableOpacity style={{top:'30%',justifyContent:'center',padding:20,}} onPress={props._onPressItem}>
    <FonTelloIcon size={100} name="plus-circled" color="#fff"/>
  </ TouchableOpacity >
 
}
 


class MyListItem extends React.PureComponent {
  state={
    isShow:false,
    date:""
  }
  _onPress = () => {
    //this.props.onPressItem(this.props.id);
    this.setState({isShow:!this.state.isShow})
  };

  render() {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center',
      flexDirection:'column',backgroundColor:'white',height:'70%',width:width*0.8,
      margin:40,borderRadius:20,elevation:20}}>
            {/* Display date time */}
            <View style={{justifyContent:'center'}}>
              <Text style={{fontSize:20}}>{this.props.date+" "+this.props.time}</Text>
            </View>
            {/* Close Button for Delete timer*/}
            <TouchableOpacity  style={{marginTop:20}} onPress={()=>{console.log("Kaboom!! You break something!!")}}>
            <Icon name="md-close-circle" size={35} color="#FF5353"/>
            </TouchableOpacity>
            {/* Edit date time */}
            <TouchableOpacity onPress={this._onPress} style={{position:'absolute',right:10,top:10}}>
              <Icon  name="md-create" size={25} color="#FF5353" style={{padding:10}}/>
            </TouchableOpacity>
             {/* Edit date time overlay screen */}
            <Overlay isVisible={this.state.isShow} onBackdropPress={this._onPress} 
            style={{justifyContent:'center',alignItems: 'center',}}>
            <View style={{justifyContent:'center'}}>
              <TextInput onFocus={async ()=>{ 
                const {action, year, month, day}= await DatePickerAndroid.open();
                if(action!=DatePickerAndroid.dismissedAction)
                  this.setState({date:day+"/"+month+"/"+year})
                  
                }} value={this.state.date} placeholder="Please choose the date" style={{padding:20}}/>
              <RNButton title={"CLOSE"}  onPress={this._onPress}/>
            </View>
            </Overlay>
      </View>
     
    );
  }
}

const Detail = props => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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

