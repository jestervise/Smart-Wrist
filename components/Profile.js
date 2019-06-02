import React, { Component } from 'react';
import { View, Text, TextInput, Platform, TouchableOpacity, ImageBackground, Alert, Dimensions, ScrollView, Animated } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { ProfileCircle } from './SvgShapes';
import firebase from './firebaseconfig';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { Permissions, Location, ImagePicker, IntentLauncherAndroid as IntentLauncher, LinearGradient } from 'expo';
import { Overlay, Button as RNButton } from 'react-native-elements';

var { height, width } = Dimensions.get("window");

const IMAGE_HEIGHT = height * 0.4;

export class Profile extends Component {
  scrollAnimatedValue = new Animated.Value(0);

  headerImage = function () {
    return firebase.storage().ref().child("images/profileImage" + firebase.auth().currentUser.uid);
  };
  constructor(props) {
    super(props);
    this.state = {
      image: require("../assets/placeholderProfilePic.png"),
      isVisible: false,
      showPhotoSelection: false,
      displayName: firebase.auth().currentUser.displayName == undefined ?
        firebase.auth().currentUser.email : firebase.auth().currentUser.displayName,
      editable: false,
    };

    this.ChooseFromGalleryAsync = this.ChooseFromGalleryAsync.bind(this);
    this.TakePhotoAsync = this.TakePhotoAsync.bind(this);
    this.textInput = React.createRef();
  }
  componentWillMount() {
    this.initializeHeaderImage();
  }
  async initializeHeaderImage() {
    //when component mount, download image from firebase storage and set it profile header
    const url = await this.headerImage().getDownloadURL();
    console.log(url);
    if (url)
      this.setState({ image: { uri: url } });
  }

  //when open calendar's button on click, turn the overlay popup visibility on and show calendar
  OpenCalender = () => {
    console.log("Open Calender method");
    this.setState({ isVisible: true });
  }
  //when profile header button on click, turn the overlay popup visibility on and show "take photo",
  //"choose from gallery" options
  ChoosePhoto = () => {
    this.setState({ showPhotoSelection: true });
  }
  //If "take photo option is selected"
  async TakePhotoAsync() {
    console.log("Take Photo method");
    //Ask for camera permissions
    let persmissions = await Permissions.askAsync(Permissions.CAMERA);
    //When it grants the permission, launch camera and hide choosePhotoSelection popup
    if (persmissions.status == "granted")
      var result = await ImagePicker.launchCameraAsync();
    this.setState({ showPhotoSelection: false });
    //Then upload to firebase storage
    if (!result.cancelled)
      this.UploadToStorage(result.uri);
  }
  //If "choose from gallery option is selected"
  async ChooseFromGalleryAsync() {
    console.log("Gallery method");
    if (Platform.OS == 'ios') {
      Permissions.askAsync(Permissions.CAMERA_ROLL).then(() => ImagePicker.launchImageLibraryAsync({ mediaTypes: 'Images', allowsEditing: true }));
    }
    else {
      let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'Images' });
      this.setState({ showPhotoSelection: false });
      if (!result.cancelled)
        this.UploadToStorage(result.uri);
    }
  }

  //When change display name button is clicked,make the username editable and focus username
  ChangeDisplayName = () => {
    this.setState({ editable: true });
    this.textInput.current.focus();
  }
  //if submit on click,make it ineditable and update the specific user's display name
  SaveDisplayName = () => {
    this.setState({ editable: false });
    firebase.auth().currentUser.updateProfile({
      displayName: this.state.displayName
    }).then(() => console.log(firebase.auth().currentUser.displayName));
  }

  //Establish connection to local storage,Set the header image to selected photo, and upload the image
  async UploadToStorage(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    this.setState({ image: { uri: uri } });
    let snapshot = await this.headerImage().put(blob);
    blob.close();
  }
  render() {
    let image = this.state.image;
    const themeColor = '#ECEBF3'
    let AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
    //Top Left Overlay 
    let TopRightOverlay = () => <Overlay onBackdropPress={() => { this.setState({ isVisible: false }); }} isVisible={this.state.isVisible} style={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Calender</Text>

        <RNCalendar />
        <RNButton title="CLOSE" onPress={() => this.setState({ isVisible: false })} />
      </View>
    </Overlay>
    //Top Right Overlay 
    let TopLeftOverlay = () => <Overlay onBackdropPress={() => { this.setState({ showPhotoSelection: false }); }} isVisible={this.state.showPhotoSelection} height="20%" style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', }}>

      <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={this.TakePhotoAsync}>
        <Text style={{ fontSize: 17 }}>Take a Photo</Text>

      </TouchableOpacity>
      <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={this.ChooseFromGalleryAsync}>
        <Text style={{ fontSize: 17 }}>Choose From Gallery</Text>
      </TouchableOpacity>

    </Overlay>

    return (
      <View style={{ flex: 1, backgroundColor: themeColor }}>
        <TopLeftOverlay />
        <TopRightOverlay />

        {/* The top banner picture */}

        <AnimatedImageBackground source={this.state.image} style={{
          width: '100%', height: IMAGE_HEIGHT,
          backgroundColor: 'red', position: 'absolute', top: 0, zIndex: 2000,
          transform: [
            {
              translateY: this.scrollAnimatedValue.interpolate({
                inputRange: [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
                outputRange: [IMAGE_HEIGHT / 2, 0, -IMAGE_HEIGHT / 1.5],
                extrapolateRight: 'clamp',
              })
            },
            {
              scale: this.scrollAnimatedValue.interpolate({
                inputRange: [-IMAGE_HEIGHT, 0],
                outputRange: [2, 1],
                extrapolateRight: 'clamp',
              })
            },
          ],
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
            <CalenderComponent OpenCalender={this.OpenCalender} />
            <EditBanner ChoosePhoto={this.ChoosePhoto} />
          </View>
          <ProfileCircle />
        </AnimatedImageBackground>
        <Animated.View style={{
          flexDirection: 'row', marginTop: IMAGE_HEIGHT, padding: 10, position: "absolute", justifyContent: "center", width: "100%", zIndex: 500, backgroundColor: "#ECEBF3", transform: [
            {
              translateY: this.scrollAnimatedValue.interpolate({
                inputRange: [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
                outputRange: [IMAGE_HEIGHT / 2, 0, -IMAGE_HEIGHT / 1.5],
                extrapolateRight: 'clamp',
              })
            },
            {
              scale: this.scrollAnimatedValue.interpolate({
                inputRange: [-IMAGE_HEIGHT, 0],
                outputRange: [2, 1],
                extrapolateRight: 'clamp',
              })
            },
          ]
        }}><View style={{ width: "20%" }} />
          <TextInput ref={this.textInput} value={this.state.displayName} editable={this.state.editable}
            onSubmitEditing={this.SaveDisplayName} onChangeText={(text) => this.setState({ displayName: text })} style={{ color: "#F68909", fontSize: 15, textAlign: "left", fontWeight: 'bold' }} />
          <EditUserName ChangeDisplayName={this.ChangeDisplayName} />
        </Animated.View>
        <UserStatus scrollAnimatedValue={this.scrollAnimatedValue} />
        <Animated.ScrollView contentContainerStyle={{ marginTop: IMAGE_HEIGHT * 1.47, paddingBottom: IMAGE_HEIGHT * 1.47, }} onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: this.scrollAnimatedValue } } }],
          { useNativeDriver: true }
        )}
          // target 120fps
          scrollEventThrottle={8} >
          <ReportFeed text="The hardest choices require the strongest wills" />
          <ReportFeed text="Fun isn’t something one considers when balancing the universe. But this… does put a smile on my face." />
          <ReportFeed text="When I’m done, half of humanity will still exist. Perfectly balanced, as all things should be. I hope they remember you." />
          <ReportFeed text="I know what it’s like to lose. To feel so desperately that you’re right, yet to fail nonetheless. Dread it. Run from it. Destiny still arrives. Or should I say, I have." />
          {/* extended ver */}
          <ReportFeed text="The hardest choices require the strongest wills" />
          <ReportFeed text="Fun isn’t something one considers when balancing the universe. But this… does put a smile on my face." />
          <ReportFeed text="When I’m done, half of humanity will still exist. Perfectly balanced, as all things should be. I hope they remember you." />
          <ReportFeed text="I know what it’s like to lose. To feel so desperately that you’re right, yet to fail nonetheless. Dread it. Run from it. Destiny still arrives. Or should I say, I have." />
          <ReportFeed text="I know what it’s like to lose. To feel so desperately that you’re right, yet to fail nonetheless. Dread it. Run from it. Destiny still arrives. Or should I say, I have." />
          <ReportFeed text="I know what it’s like to lose. To feel so desperately that you’re right, yet to fail nonetheless. Dread it. Run from it. Destiny still arrives. Or should I say, I have." />
          <ReportFeed text="I know what it’s like to lose. To feel so desperately that you’re right, yet to fail nonetheless. Dread it. Run from it. Destiny still arrives. Or should I say, I have." />
        </Animated.ScrollView>
      </View>);
  }
}


class UserStatus extends Component {
  constructor(props) {
    super(props)
    this.state = {

      location: null,
    }
  }


  async getLocationAsync() {
    //If location services is enabled
    let enabled = await Location.hasServicesEnabledAsync();
    if (enabled) {
      //get current location 
      let location = await Location.getCurrentPositionAsync({});
      let locationAddress = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      this.setState({ location: locationAddress });
    }
    else {
      //If no location enabled, navigate user location settings to enable
      Alert.alert("Reminder", "Please Turn On The Location Services", [{
        text: 'OK', onPress: async () => {
          let x = await IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS);
          //If done, observe user location, and when location changed,reset user location
          if (x)
            Location.watchPositionAsync({}, async (location) => {
              console.log(location);
              let locationAddress = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude });
              this.setState({ location: locationAddress });
            });
        }
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      }]);
    }
  }

  componentWillMount() {
    this.getLocationAsync();
  }

  //bottom status 
  render() {
    let location = "Loading";

    //Format the location data to state and country
    if (this.state.location) {
      location = this.state.location[0].region + "," + this.state.location[0].country;
    }

    return (
      <Animated.View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ECEBF3',
        marginTop: height * 0.45, position: 'absolute', transform: [
          {
            translateY: this.props.scrollAnimatedValue.interpolate({
              inputRange: [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
              outputRange: [IMAGE_HEIGHT / 2, 0, -IMAGE_HEIGHT / 1.5],
              extrapolateRight: 'clamp',
            })
          },
          {
            scale: this.props.scrollAnimatedValue.interpolate({
              inputRange: [-IMAGE_HEIGHT, 0],
              outputRange: [2, 1],
              extrapolateRight: 'clamp',
            })
          },
        ], width: "100%"
      }}>
        {/* Left indentation*/}
        <View style={{ flex: 0.3, backgroundColor: 'blue' }} />
        {/* The input name */}
        <View style={{ flex: 0.6, alignSelf: 'flex-end', marginVertical: 20, marginTop: 20 }}>
          {/* <Animated.View style={{ flexDirection: 'row'}}>
            <TextInput ref={this.textInput} value={this.state.displayName} editable={this.state.editable} 
            onSubmitEditing={this.SaveDisplayName} onChangeText={(text) => this.setState({ displayName: text })} style={{ color: "#F68909", fontSize: 15, textAlign: "left", fontWeight: 'bold' }} />
            <EditUserName ChangeDisplayName={this.ChangeDisplayName} />
          </Animated.View> */}
          <Animated.View style={{
            flexDirection: 'row', paddingTop: 5, opacity: this.props.scrollAnimatedValue.interpolate({
              inputRange: [-IMAGE_HEIGHT, IMAGE_HEIGHT],
              outputRange: [1, 0],
              extrapolateRight: 'clamp',
            }), zIndex: -1
          }}>
            <Icon name="md-pin" size={12} color="#6D7275" />
            <Text style={{ paddingLeft: 10, color: '#6D7275', fontSize: 12, textAlign: 'left', fontWeight: 'bold' }}>{location}</Text>
          </Animated.View>
        </View>
        {/* Right Button */}
        {/* <RNButton title="Thanos" titleStyle={{color:'#FF6A6A'}} buttonStyle={{backgroundColor:'transparent',shadowColor: "#919191",
        shadowOffset: {
        width: 0,
        height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
  
        elevation: 1,padding:20,paddingVertical:10,marginRight:20,borderRadius:10}} style={{flex:0.2,backgroundColor:'yellow',marginRight:10}}/> */}
      </Animated.View>
    )

  }

}


const ReportFeed = (props) => {
  const themeColor = '#ECEBF3'
  const style = {
    padding: 20, backgroundColor: '#FF6A6A', width: '80%', height: 'auto',
    borderRadius: 0, alignItems: 'center', shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  }
  return (
    <View style={{ alignItems: 'center', marginBottom: 20, justifyContent: 'center', }}>
      <View style={style}>
        <View style={{ width: 20, height: 20, backgroundColor: themeColor, borderRadius: 50, position: 'absolute', left: -10, top: "60%", borderWidth: 2, borderColor: '#F15025' }} />
        <View><Text style={{ color: themeColor }}>{props.text}</Text></View>
      </View>
    </View>
  )
}

//Profile's Function Component/Icons in Profile page
const EditBanner = (props) => {
  return <TouchableOpacity onPress={props.ChoosePhoto}>
    <Icon name="md-create" size={23} color="#FFAEAE" style={{ paddingRight: 20, paddingTop: 20, zIndex: 1500 }} />
  </TouchableOpacity>
}
const CalenderComponent = (props) => {
  return <TouchableOpacity onPress={props.OpenCalender}>
    <Icon name="md-calendar" size={25} color="#FFAEAE" style={{ paddingLeft: 20, paddingTop: 20, zIndex: 1500 }} />
  </TouchableOpacity>
}

const EditUserName = (props) => {
  return <TouchableOpacity onPress={props.ChangeDisplayName}>
    <Icon name="md-create" size={15} color="#FF5353" style={{ paddingLeft: 10 }} />
  </TouchableOpacity>
}
