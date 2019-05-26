import React, { Component } from 'react';
import { View, ScrollView, Image,Text,TouchableOpacity,BackAndroid,Switch,TouchableWithoutFeedback,Animated } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import {Overlay, Button,Input } from 'react-native-elements'
import firebase from "./firebaseconfig"
import {AppLoading,LinearGradient} from 'expo'
import {setCaregiver, caregiver} from "./ContactList"
import {signOutPopUp} from "../functions/SignOut"


export class Settings extends Component {
 
  constructor(props){
    super(props)
    this.state={
      isVisible:false,
      value:"",
      isToggle:true,
      isLoading:true
    }
   this._TriggerChangeCaregiverNameOverlay= this._TriggerChangeCaregiverNameOverlay.bind(this)
    
  }

   _TriggerChangeCaregiverNameOverlay=()=>{
    console.log("change caregiver number")
    this.setState({isVisible:true})
  }
  
  componentDidMount(){
    let userId= firebase.auth().currentUser.uid;
    let shouldReceiveSMS=firebase.database().ref("caregiverDetails/"+userId).child("shouldReceiveSMS")
    shouldReceiveSMS.once("value",(snapshot)=>{
      this.setState({isToggle:snapshot.val(),
      isLoading:false});
      console.log(this.state.isToggle)
    })
  }

  ChangeCaregiverNum=()=>{
    let regex =/^\+?[1-9]\d{1,14}$/
    let isString = /[0-9]+/
    if(regex.test(this.state.value) || isString.test(this.state.value)==false){
      this.setState({value:"Invalid format"})
      setTimeout(()=>{this.setState({value:""})},1500)
    }else{
      let userId= firebase.auth().currentUser.uid;
      let phoneNumber=firebase.database().ref("caregiverDetails/"+userId).child("phoneNumber")
      if(this.state.value.charAt(0)!="+"){
        phoneNumber.set("+"+this.state.value);
      }else{
        phoneNumber.set(this.state.value);
      }
      this.setState({isVisible:false});
      this.setState({value:""})
      setCaregiver(this.state.value)
    }
    
  }

  ReceiveSms=()=>{
    this.setState({isToggle:!this.state.isToggle})
    this.ToggleSendingFunction()
  }

  ToggleSendingFunction(){
    let userId = firebase.auth().currentUser.uid;
    if(this.state.isToggle==false){
      firebase.database().ref("caregiverDetails/"+userId+"/shouldReceiveSMS").set("true");
    }else{
      firebase.database().ref("caregiverDetails/"+userId+"/shouldReceiveSMS").set("false");
    }
  }

  render() {
    let buttonStyle={marginBottom:20}
    let text= ["Change Caregiver Contact Number","Sign Out", "Receive SMS","Close App",
    "Duis aute irure dolor in reprehenderit"]
    let contact=(
    <Overlay isVisible={this.state.isVisible}>
    <View style={{flex:1,justifyContent:'space-around'}}>
       {/*Input with label */}
      <Input  style={{flex:0.6}} placeholder='Phone number w country code'
  leftIcon={{ type: 'font-awesome', name: 'pencil',color:"tomato", }}
  value={this.state.value} onChangeText={(value)=>{this.setState({value:value})}}
  dataDetectorTypes="phoneNumber" keyboardType="phone-pad" maxLength={20} label="Enter phone number with country code" labelStyle={
    {color:'tomato',fontSize:20,textAlign:'center'}} inputStyle={{color:'tomato',paddingLeft:10,fontSize:14}}
    />
    {/*Buttons */}
    <View style={{flex:0.4,justifyContent:"space-between"}}>
      <Button title="Submit" style={buttonStyle} onPress={this.ChangeCaregiverNum}/>
      <Button title="Clear number" style={buttonStyle} onPress={()=>{
        setCaregiver(null)
        let userId = firebase.auth().currentUser.uid;
        firebase.database().ref('caregiverDetails/'+userId+"/phoneNumber").remove();
        this.setState({isVisible:false})
        }}/>
      <Button title="Close" style={buttonStyle} onPress={()=>{this.setState({isVisible:false})}}/>
    </View>
    
     
    </View>
     
    </Overlay>)

    return (<LinearGradient colors={['#4D9DE0','#E1BC29']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      
      <View source={require("../assets/settings_background.png")} style={{ width: '100%', height: '100%' }}>
        <Icon name="md-settings" size={34} color="#fff" style={{ alignSelf: 'flex-end', margin: 10, paddingTop: 40 }} />
        <View style={{backgroundColor:'white',width:'95%',margin:10,height:'0.4%',opacity:0.7}}></View>
        <View style={{ marginLeft: 20, marginBottom: 10,marginTop:20,flexDirection:'row' }}>
          <Image source={require("../assets/bubble.png")}  />
          <Text style={{position:'absolute',marginLeft:10,marginTop:2,fontSize:10}}>General</Text>
        </View>
        <ScrollView>
         <SettingsObject text={text[0]} handleFunction={this._TriggerChangeCaregiverNameOverlay}/>
         <SettingsObject text={text[1]} handleFunction={()=>{signOutPopUp(this.props.screenProps.rootNavigation)}}/>
         <ToggleObject text={text[2]} handleFunction={this.ReceiveSms} isToggle={this.state.isToggle} isLoading={this.state.isLoading}/>
         <SettingsObject text={text[3]} handleFunction={()=>BackAndroid.exitApp()}/>
        </ScrollView>
        {contact}
      </View>


    </LinearGradient>);
  }
}

const SettingsObject=(props)=> {
    changeName=()=>{
      props.handleFunction();
    }

    return <View style={{ backgroundColor: '#FF5858', marginLeft: 10, marginRight: 10,
     marginBottom:2,height: 55, flexDirection: 'row',borderRadius:5,
     elevation:3,justifyContent:'space-between',alignItems:'center' }}>
      <Text style={{ color: '#fff',fontSize:12, paddingLeft: 20,opacity:0.8 }}>{props.text}</Text>
      <TouchableOpacity onPress={this.changeName}>
        <Icon name="md-arrow-dropright" size={20} color="white" style={{paddingRight:10}}/>
      </TouchableOpacity>
      
    </View>;
}

class ToggleObject  extends Component{

  constructor(props){
    super(props)
    this.state={
      moveCircle:new Animated.Value(35),
      moveText:new Animated.Value(5),
      circleColor:new Animated.Value(0)
    }
  }

  changeName=()=>{
    this.props.handleFunction();
    if(this.props.isToggle==false){
      this.toggleAnimation(35,this.state.moveCircle)
      this.toggleAnimation(5,this.state.moveText)
      this.toggleAnimation(0,this.state.circleColor)
      
    }else{
      this.toggleAnimation(0,this.state.moveCircle)
      this.toggleAnimation(32,this.state.moveText)
      this.toggleAnimation(150,this.state.circleColor)
      
    }
  }

  toggleAnimation=(toVal,animatableValue)=>{
    Animated.timing(animatableValue,
      {
        toValue:toVal,
        duration:500
      }).start()
  }

  render(){
    let interpolateColor=this.state.circleColor.interpolate({
      inputRange:[0,150],
      outputRange:["rgba(188,255,136,1)","rgba(200,100,88,1)"]
    })
    return <View style={{ backgroundColor: '#FF5858', marginLeft: 10, marginRight: 10,
    marginBottom:2,height: 55, flexDirection: 'row',borderRadius:5,
    elevation:3,justifyContent:'space-between',alignItems:'center' }}>
      <Text style={{ color: '#fff',fontSize:12, paddingLeft: 20,opacity:0.8 }}>{this.props.text}</Text>
  {/*Switch */}
        {this.props.isLoading==true?<AppLoading/>:
        <TouchableWithoutFeedback nPress={this.changeName}>
          <View style={{backgroundColor:"transparent",width:65,height:30,alignItems: 'center',borderRadius:15,
          borderColor:'#4D9DE0',borderWidth:3,flexDirection:'row',justifyContent:"space-between",marginRight:10}}>
            {/*Circle */}
            <Animated.View  style={{backgroundColor:interpolateColor,width:27,height:27,borderRadius:30,elevation:10,
            borderColor:"#fff",borderWidth:3,left:this.state.moveCircle}}/>
            <Animated.Text style={{fontSize:13,color:"#fff",position:'absolute',
            left:this.state.moveText}}>{this.props.isToggle?"ON":"OFF"}</Animated.Text>
          </View>
        </TouchableWithoutFeedback>
        }
    </View>;

  }
  
}
