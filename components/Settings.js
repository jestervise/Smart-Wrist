import React, { Component } from 'react';
import { View, ScrollView, Image, ImageBackground,Text } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
export class Settings extends Component {
  render() {
    return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      <ImageBackground source={require("../assets/settings_background.png")} style={{ width: '100%', height: '100%' }}>
        <Icon name="md-settings" size={34} color="#fff" style={{ alignSelf: 'flex-end', margin: 10, paddingTop: 40 }} />
        <ScrollView>
          <Image source={require("../assets/bubble.png")} style={{ marginLeft: 20, marginBottom: 5 }} />
          <SettingsObject />
          <SettingsObject />
          <SettingsObject />
          <SettingsObject />
          <SettingsObject />
          <SettingsObject />
        </ScrollView>
      </ImageBackground>


    </View>);
  }
}

const SettingsObject=()=> {
    return <View style={{ backgroundColor: '#FF5858', marginLeft: 10, marginRight: 10, marginBottom:2,height: 50, flexDirection: 'row',elevation:3 }}>
      <Text style={{ color: '#fff', alignSelf: 'center', paddingLeft: 20 }}>Color!!</Text>
    </View>;
}
