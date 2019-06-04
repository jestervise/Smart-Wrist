import React, { Component } from 'react';
import {
  View, Text, Button, DatePickerAndroid, TimePickerAndroid, DatePickerIOS, Platform,
  ScrollView, TouchableOpacity, Image, ImageBackground, Alert, Dimensions, Animated
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import styles from '../Styles';
import { MiddleCircle } from './SvgShapes';
import firebase from './firebaseconfig';
import StepsCounter from './StepsCounter';
import Call from './Call';
import Modal from 'react-native-modal';
import { Permissions } from 'expo';
import { writeUserData } from '../functions/writeUserData';
import { createCalenderEvent } from '../functions/handleCalenderEvent';
var { height, width } = Dimensions.get("window");
import { signOutPopUp } from '../functions/SignOut'

export class Feed extends Component {
  constructor(props) {
    super(props);
    this.AddTimer = this.AddTimer.bind(this);
    this.state = {
      isIOS: false,
      chosenDate: new Date(),
      location: null,
      iconColor: new Animated.Value(0)
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
          createCalenderEvent(year, month, day, hour, minute);
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
    let duration = 200
    if (event.nativeEvent.contentOffset.y > 240)
      Animated.timing(this.state.iconColor, {
        toValue: 150,
        duration: duration

      }).start();

    else if (event.nativeEvent.contentOffset.y < 10)
      Animated.timing(this.state.iconColor, {
        toValue: 0,
        duration: duration
      }).start();
    else if (this.state.iconColor != new Animated.Value(0) && event.nativeEvent.contentOffset.y < 235)
      Animated.timing(this.state.iconColor, {
        toValue: 0,
        duration: duration
      }).start();
    else
      return;
  };
  render() {
    let buttonColor = this.state.iconColor.interpolate({
      inputRange: [0, 150],
      outputRange: ["rgba(255,255,255,1)", "rgba(0,0,0,1)"]
    })

    const AnimatedIcon = Animated.createAnimatedComponent(Icon);

    return (<View style={{ flex: 1, backgroundColor: '#EFEBE6' }}>
      <View style={{ position: 'absolute', left: 10, top: 20, zIndex: 100, }}>
        <AnimatedIcon style={{ paddingLeft: 10, paddingTop: 20, color: buttonColor }} onPress={() => this.props.navigation.openDrawer()} name="md-menu" size={30} />
      </View>
      <View style={{ position: 'absolute', right: 10, top: 20, zIndex: 100, }}>
        <AnimatedIcon name="md-log-out" size={30} style={{ paddingRight: 10, paddingTop: 20, color: buttonColor }} onPress={() => { signOutPopUp(this.props.screenProps.rootNavigation) }} />
      </View>
      <ScrollView ref={(c) => this._scrollView = c} keyboardShouldPersistTaps="never" onScroll={this.handleScroll}>
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

        {this.state.isIOS && <Button title="Submit" onPress={() => { this.props.navigation.navigate('TimerStack', { year: year, month: month, day: day }); }} />}

        <View style={{ width: "100%", height: 200, backgroundColor: "white", marginBottom: 20 }}>
          <StepsCounter />
        </View>
        <TouchableOpacity style={{
          backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center', padding: 5, marginBottom: 20, alignSelf: "center",
          borderRadius: 100, width: "12%"
        }}
          onPress={() => { this._scrollView.scrollTo({ x: 0, y: 0, animated: true }) }}>
          <Icon name="md-arrow-round-up" size={30} color="#FF5A5A" />
        </TouchableOpacity>
      </ScrollView>

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
