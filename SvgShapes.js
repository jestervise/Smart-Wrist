import {Svg,Circle,Text,Defs,TSpan,LinearGradient,Stop} from 'react-native-svg'
import {Image} from 'react-native'
import React from 'react';
import firebase from './firebaseconfig'
import {Component} from 'react'
import ReactNative from 'react-native'
import Icon from '@expo/vector-icons/Ionicons';

//Variable to store the current humidity and temperature
let tempHumid=[];


export class MiddleCircle extends Component{
  
  constructor(props){
    super(props);
    this.state={
      temp:"",
      humid:"",
    }
    let userId=firebase.auth().currentUser.uid;
   
    this.readUserData=this.readUserData.bind(this);
    this.readUserData(userId);
  }

  readUserData(userId) {
     //Read the user temperature and humidity and rerender when it's done
    return Promise.all(
      firebase.database().ref("tempHumidData/"+userId+"/-Lc_jjC0XmlMz5rz3Vzf").on('value',(snapshot) =>{
        tempHumid[0]=snapshot.val().temp;
        tempHumid[1]=snapshot.val().humid;
        this.setState({temp:tempHumid[0],humid:tempHumid[1]});
        console.log(tempHumid)
        //return tempHumid
      })
    ) 
      
   
    
  }
  
  render(){
   
    return <Svg height={152} width={170} style={{alignItems:'center',justifyContent:'center',position:'relative',top:'30%',}}>
          
    <Circle
      cx={75}
      cy={75}
      r={75}
      x={10}
      y={1}
      strokeWidth={2}
      stroke="#fff"
      fill="url(#grad)"
    />
    <Text x="75"
      y="75"
      fill="white"
      dx="10"
      fontSize="48"
      fontWeight="bold"
      textAnchor="middle" style={{}}>
      <TSpan  >{this.state.temp}</TSpan>
      <TSpan x="75" y="105" dx="10" fontSize="14">Temperature</TSpan>
      <TSpan x="75" y="130" dx="10" fontSize="14">°C</TSpan>
    </Text>
    <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="75" y2="150">
            <Stop offset="0" stopColor="#FF4B23" stopOpacity="1" />
            <Stop offset="1" stopColor="#9A240A" stopOpacity="0" />
        </LinearGradient>
    </Defs>
    <Image source={require("./assets/humidity.png")} style={{ flex: 1,
    aspectRatio: 0.15, 
    resizeMode: 'contain',
    position:'relative',
    top:'72%',left:'25%',
    }}/>
    <ReactNative.Text style={{position:'relative',
    top:'22%',left:'45%',color:'white'}}>{this.state.humid+"%"}</ReactNative.Text>
    </Svg> 
  }
    
  }

  export class ProfileCircle extends Component{
    render(){
      return <Svg height={90} width={100} style={{position:'absolute',bottom:'-15%',left:0}}>
          
      <Circle
        cx={45}
        cy={45}
        r={45}
        x={10}
        y={1}
        strokeWidth={2}
        stroke="#fff"
        fill="#FFAEAE"
      />
      <Icon name="md-person" size ={55} color="white" style={{position:'relative',top:'40%',left:'35%'}}/>
      </Svg>
    }
  }