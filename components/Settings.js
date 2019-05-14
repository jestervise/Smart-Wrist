import React, { Component } from 'react';
import { View, ScrollView, Image, ImageBackground,Text } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
export class Settings extends Component {
  settingsComponent=[]
  constructor(props){
    super(props)
    let text= ["Change Caregiver Contact Number","Lorem ipsum dolor sit amet", 
    "consectetur adipiscing elit", "sed do eiusmod tempor"," incididunt ut labore et",
    "Duis aute irure dolor in reprehenderit"]
    for(var i=0;i<6;i++){
      this.settingsComponent.push(<SettingsObject text={text[i]}/>)
    }
  }

  render() {
    return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'#F8BE02' }}>
      
      <View source={require("../assets/settings_background.png")} style={{ width: '100%', height: '100%' }}>
        <Icon name="md-settings" size={34} color="#fff" style={{ alignSelf: 'flex-end', margin: 10, paddingTop: 40 }} />
        <View style={{backgroundColor:'white',width:'95%',margin:10,height:'0.4%',opacity:0.7}}></View>
        <View style={{ marginLeft: 20, marginBottom: 10,marginTop:20,flexDirection:'row' }}>
          <Image source={require("../assets/bubble.png")}  />
          <Text style={{position:'absolute',marginLeft:4,fontSize:10}}>General</Text>
        </View>
        <ScrollView>
          {this.settingsComponent}
        </ScrollView>
      </View>


    </View>);
  }
}

const SettingsObject=(props)=> {
    return <View style={{ backgroundColor: '#FF5858', marginLeft: 10, marginRight: 10,
     marginBottom:2,height: 55, flexDirection: 'row',borderRadius:5,
     elevation:3,justifyContent:'space-between',alignItems:'center' }}>
      <Text style={{ color: '#fff',fontSize:12, paddingLeft: 20,opacity:0.8 }}>{props.text}</Text>
      <Icon name="md-arrow-dropright" size={20} color="white" style={{paddingRight:10}}/>
    </View>;
}
