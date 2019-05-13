import React, { Component } from 'react';
import { View, Text, Button, DatePickerAndroid, TimePickerAndroid, DatePickerIOS, Platform, 
    ScrollView, TouchableOpacity, Image, ImageBackground, Alert,Dimensions } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import styles from '../Styles';
import { MiddleCircle } from './SvgShapes';
import firebase from './firebaseconfig';
import StepsCounter from './StepsCounter';
import Call from './Call';
import Modal from 'react-native-modal';
import { Permissions } from 'expo';
import { writeUserData } from '../functions/writeUserData';
import { createCalenderEvent } from '../functions/createCalenderEvent';
var { height, width } = Dimensions.get("window");

export class Feed extends Component {
  constructor(props) {
    super(props);
    this.AddTimer = this.AddTimer.bind(this);
    this.state = {
      isIOS: false,
      chosenDate: new Date(),
      location: null,
      iconColor: "#fff"
    };
    this.getLocationAsync = this.getLocationAsync.bind(this);
  }
  async AddTimer() {
    if (Platform.OS == 'android') {
      //Date Picker
      const { action, year, month, day } = await DatePickerAndroid.open();
      if (action !== DatePickerAndroid.dismissedAction) {
        const { action, hour, minute } = await TimePickerAndroid.open({
          hour: new Date().getHours(),
          minute: new Date().getMinutes(),
          is24Hour: false,
        });
        if (action !== TimePickerAndroid.dismissedAction) {
          var uid = firebase.auth().currentUser.uid;
          createCalenderEvent(year, month + 1, day, hour, minute);
          writeUserData(uid, day, month + 1, year, hour, minute).then(() => this.props.navigation.navigate('TimerStack'));
        }
      }
    }
    else {
      this.setState({
        isIOS: true
      });
    }
  }
  componentWillMount() {
    this.getLocationAsync();
  }
  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log("they passed through here");
    console.log(status);
    if (status !== 'granted') {
      console.log(status);
    }
  };
  componentDidMount() {
    //Linking.openURL(`tel:${"0123456789"}`);
  }

  //If user were to scroll to certain point, change the icon color to black
  handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y > 240)
      this.setState({ iconColor: '#000' });
    else if (event.nativeEvent.contentOffset.y < 10) {
      this.setState({ iconColor: '#fff' });
    }
    else
      this.setState({ iconColor: '#fff' });
  };
  render() {
    return (<View style={{ flex: 1, backgroundColor: '#EFEBE6' }}>
      <View style={{ position: 'absolute', left: 10, top: 20, zIndex: 100, }}>
        <Icon style={{ paddingLeft: 10, paddingTop: 20 }} onPress={() => this.props.navigation.openDrawer()} name="md-menu" size={30} color={this.state.iconColor} />
      </View>
      <View style={{ position: 'absolute', right: 10, top: 20, zIndex: 100, }}>

        <Icon name="md-log-out" size={30} color={this.state.iconColor} style={{ paddingRight: 10, paddingTop: 20 }} onPress={() => {
          Alert.alert("Sign Out", "Are you sure?", [
            {
              text: 'Yes', style: 'default', onPress: () => {
                firebase.auth().signOut().then(() => {
                  let user = firebase.auth.currentUser;
                  if (user) {
                    return "logged in";
                  }
                  else {
                    return "logged out";
                  }
                }).then((logged) => {
                  if (logged == "logged out") {
                    console.log(logged);
                    navigation.navigate('ProfileStack'); // Navigate ProfileStack
                  }
                }).catch((error) => console.log(error));
              }
            },
            { text: 'No', style: 'cancel' },
          ] //AlertButton
          );
        }} />
      </View>
      <ScrollView keyboardShouldPersistTaps="never" onScroll={this.handleScroll}>
        <ImageBackground resizeMode='contain' style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: height * (64 / 100), marginBottom: '5%', marginTop: 0, paddingTop: 0, top: -20 }} source={require("../assets/dashboardBackground.png")}>

          <MiddleCircle />
          <Call />
          <TouchableOpacity style={{ flex: 0.1, marginBottom: 20 }} onPress={() => this.props.navigation.navigate('Detail')}>
            <Text style={{ color: '#fff' }}>More Details <Icon name="md-arrow-dropdown" size={18} color="#fff" /></Text>
          </TouchableOpacity>
        </ImageBackground>

        <DashBoardButton iconLocation={require("../assets/AddTimerIcon.png")} text={{ header: "Add Timer", desc: 'Remind you to eat medicine' }} func={this.AddTimer} rightButton="md-add-circle-outline" />
        {this.state.isIOS && <Modal>
          <View>
            <DatePickerIOS date={this.state.chosenDate} onDateChange={(newDate) => { this.setState({ chosenDate: newDate }); }} /></View>
        </Modal>}

        <DashBoardButton iconLocation={require("../assets/AddTimerIcon.png")} text={{ header: "Movement Report", desc: 'Check your movement' }} func={this.AddTimer} rightButton="md-add-circle-outline" />

        {this.state.isIOS && <Button title="Submit" onPress={() => { this.props.navigation.navigate('TimerStack', { year: year, month: month, day: day }); }} />}

        <Button title="PlacehodlerButton" onPress={() => this.props.navigation.navigate('Detail')} />
      </ScrollView>
      <StepsCounter />
    </View>);
  }
}

class DashBoardButton extends Component {
  render() {
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
