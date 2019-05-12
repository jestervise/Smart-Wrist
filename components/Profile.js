import React, { Component } from 'react';
import { View, Text, TextInput, Platform, TouchableOpacity, ImageBackground, Alert ,Dimensions} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { ProfileCircle } from './SvgShapes';
import firebase from './firebaseconfig';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { Permissions, Location, ImagePicker, IntentLauncherAndroid as IntentLauncher } from 'expo';
import { Overlay, Button as RNButton } from 'react-native-elements';
var { height, width } = Dimensions.get("window");

export class Profile extends Component {
  headerImage = function () {
    return firebase.storage().ref().child("images/profileImage" + firebase.auth().currentUser.uid);
  };
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      displayName: firebase.auth().currentUser.displayName == undefined ?
        firebase.auth().currentUser.email : firebase.auth().currentUser.displayName,
      editable: false,
      image: require("../assets/placeholderProfilePic.png"),
      isVisible: false,
      showPhotoSelection: false
    };
    this.textInput = React.createRef();
    this.ChooseFromGalleryAsync = this.ChooseFromGalleryAsync.bind(this);
    this.TakePhotoAsync = this.TakePhotoAsync.bind(this);
  }
  componentWillMount() {
    this.initializeHeaderImage();
    this.getLocationAsync();
  }
  async initializeHeaderImage() {
    //when component mount, download image from firebase storage and set it profile header
    const url = await this.headerImage().getDownloadURL();
    console.log(url);
    if (url)
      this.setState({ image: { uri: url } });
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
  //When change display name button is clicked,make the username editable and focus username
  ChangeDisplayName() {
    this.setState({ editable: true });
    this.textInput.current.focus();
  }
  //if submit on click,make it ineditable and update the specific user's display name
  SaveDisplayName() {
    this.setState({ editable: false });
    firebase.auth().currentUser.updateProfile({
      displayName: this.state.displayName
    }).then(() => console.log(firebase.auth().currentUser.displayName));
  }
  //when open calendar's button on click, turn the overlay popup visibility on and show calendar
  OpenCalender() {
    console.log("Open Calender method");
    this.setState({ isVisible: true });
  }
  //when profile header button on click, turn the overlay popup visibility on and show "take photo",
  //"choose from gallery" options
  ChoosePhoto() {
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
    let location = "Loading";
    let image = this.state.image;
    //Format the location data to state and country
    if (this.state.location) {
      location = this.state.location[0].region + "," + this.state.location[0].country;
    }
    return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* Top Left Overlay */}
      <Overlay onBackdropPress={() => { this.setState({ isVisible: false }); }} isVisible={this.state.isVisible} style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Calender</Text>

            <RNCalendar />
            <RNButton title="CLOSE" onPress={() => this.setState({ isVisible: false })} />
        </View>
      </Overlay>
      {/* Top Right Overlay */}
      <Overlay onBackdropPress={() => { this.setState({ showPhotoSelection: false }); }} isVisible={this.state.showPhotoSelection} height="20%" style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', }}>
       
            <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={this.TakePhotoAsync}>
                <Text style={{ fontSize: 17 }}>Take a Photo</Text>

            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={this.ChooseFromGalleryAsync}>
                <Text style={{ fontSize: 17 }}>Choose From Gallery</Text>
            </TouchableOpacity>

      </Overlay>

      <ImageBackground source={this.state.image} style={{ top: 0, width: '100%', position: 'absolute', height: height * 0.4 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
          <CalenderComponent OpenCalender={this.OpenCalender.bind(this)} />
          <EditBanner ChoosePhoto={this.ChoosePhoto.bind(this)} />
        </View>
        <ProfileCircle />
      </ImageBackground>

      <View style={{ top: '5%', marginTop: '5%', left: '10%', width: "65%" }}>
        <View style={{ flexDirection: 'row' }}>
          <TextInput ref={this.textInput} value={this.state.displayName} editable={this.state.editable} onSubmitEditing={this.SaveDisplayName.bind(this)} onChangeText={(text) => this.setState({ displayName: text })} style={{ color: "#F68909", fontSize: 15, textAlign: "left", fontWeight: 'bold' }} />
          <EditUserName ChangeDisplayName={this.ChangeDisplayName.bind(this)} />
        </View>
        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
          <Icon name="md-pin" size={12} color="#FF5353" />
          <Text style={{ paddingLeft: 10, color: '#FF5353', fontSize: 12, textAlign: 'left' }}>{location}</Text>
        </View>
      </View>
    </View>);
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
