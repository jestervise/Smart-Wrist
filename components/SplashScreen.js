import React from 'react';
import firebase from './firebaseconfig'
import {Component} from 'react'
import ReactNative from 'react-native'
import {Animated,Easing,View} from 'react-native'
import LottieView from 'lottie-react-native'

export default class SplashScreen extends Component{
    state={splashProgress: new Animated.Value(0)}

    async componentDidMount(){
        return await Animated.timing(this.state.splashProgress,{
            toValue:1,
            duration:7000,
            easing:Easing.linear,
            delay:700
          }).start()
    }

    render(){
        return <LottieView source={require("../assets/splash_screen.json")} autoPlay progress={this.state.splashProgress}/>
  
    }
}