import { Svg, Circle, Text, Defs, TSpan, LinearGradient, Stop, Image as SvgImage, ClipPath } from 'react-native-svg'
import { Image, Platform } from 'react-native'
import React from 'react';
import firebase from './firebaseconfig'
import { Component } from 'react'
import ReactNative from 'react-native'
import { Permissions, ImagePicker } from 'expo'
import Icon from '@expo/vector-icons/Ionicons';

//Variable to store the current humidity and temperature
export let tempHumid = ["", ""];


export class MiddleCircle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      temp: "",
      humid: "",
    }


    this.readUserData = this.readUserData.bind(this);

  }
  componentDidMount() {
    let userId = firebase.auth().currentUser.uid;
    this.readUserData(userId);
  }
  readUserData(userId) {
    // firebase.database().ref("tempHumidData/"+userId).set({temp:0,humid:0});

    //Read the user temperature and humidity and rerender when it's done
    return Promise.all(

      firebase.database().ref("tempHumidData/" + userId + "/-Lc_jjC0XmlMz5rz3Vzf/temp").on('value', (snapshot) => {
        this.setState({ temp: snapshot.val() });
      }),
      firebase.database().ref("tempHumidData/" + userId + "/-Lc_jjC0XmlMz5rz3Vzf/humid").on('value', (snapshot) => {

        this.setState({ humid: snapshot.val() });
      })
    )





  }

  render() {

    return <Svg height={152} width={170} style={{ alignItems: 'center', justifyContent: 'center', position: 'relative', top: '30%', }}>

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
      <Image source={require("../assets/humidity.png")} style={{
        flex: 1,
        aspectRatio: 0.15,
        resizeMode: 'contain',
        position: 'relative',
        top: '72%', left: '25%',
      }} />
      <ReactNative.Text style={{
        position: 'relative',
        top: '22%', left: '45%', color: 'white'
      }}>{this.state.humid + "%"}</ReactNative.Text>
    </Svg>
  }

}

export class ProfileCircle extends Component {

  constructor(props) {
    super(props)
    this.state = {
      iconSet: false,
      avatar: null
    }
    this.UploadToStorage = this.UploadToStorage.bind(this)
    this.ChooseFromGalleryAsync = this.ChooseFromGalleryAsync.bind(this)

  }

  async componentDidMount() {
    const url = await this.headerImage().getDownloadURL();
    console.log(url)
    if (url)
      this.setState({ avatar: { uri: url } })
  }

  headerImage = function () {
    return firebase.storage().ref().child("images/avatar" + firebase.auth().currentUser.uid)
  }

  //If "choose from gallery option is selected"
  async ChooseFromGalleryAsync() {
    console.log("Gallery method")
    if (Platform.OS == 'ios') {
      Permissions.askAsync(Permissions.CAMERA_ROLL).then(() =>
        ImagePicker.launchImageLibraryAsync({ mediaTypes: 'Images', allowsEditing: true })
      );
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'Images' })

      if (!result.cancelled) {
        this.UploadToStorage(result.uri);
      }


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


    this.setState({ avatar: { uri: uri } });
    let snapshot = await this.headerImage().put(blob)
    blob.close();
  }

  render() {
    return <Svg height={100} width={110} style={{ position: 'absolute', bottom: '-15%', left: 0 }}>
      <Defs>
        <ClipPath id="clip">
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
        </ClipPath>
      </Defs>
      <Circle
        cx={45}
        cy={45}
        r={45}
        x={10}
        y={1}
        strokeWidth={2}
        stroke="#fff"
        fill="#FFAEAE"
        onPress={this.ChooseFromGalleryAsync}
      />
      <SvgImage href={this.state.avatar} cx={45}
        width={110}
        height={120}
        x={10}
        y={-20}
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#clip)"

      />
      {this.state.avatar == null && <Icon name="md-person" size={55} color="white" style={{ position: 'relative', top: '40%', left: '35%' }} />
      }
    </Svg>
  }
}



export class TimerCircle extends Component {
  render() {
    return <Svg height={20} width={40} style={{ top: 0, left: '48%', marginTop: 40, }}>

      <Circle
        cx={8}
        cy={7}
        r={3}
        fill="#D3D3D3"
      />
      <Circle
        cx={20}
        cy={5}
        r={5}
        fill="#fff"
      />
      <Circle
        cx={32}
        cy={7}
        r={3}
        fill="#D3D3D3"
      />
    </Svg>
  }
}