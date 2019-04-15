import React from 'react';
import {View,Image,ImageBackground,TouchableOpacity,Text,Alert } from 'react-native';
import styles from './Styles'
import * as Animatable from 'react-native-animatable';
import {Font} from 'expo';


export class Auth extends React.Component{
    ImageBackground = Animatable.createAnimatableComponent(ImageBackground);
    
    constructor(props){
        super(props);
        this.state={
            fontLoaded:false,
            anim:"slideOutDown"
        }

        this._onPressButton= this._onPressButton.bind(this);
    }
    
    _onPressButton(){
        this.setState({anim:'slideOutUp'});
        Alert.alert("next scene");
        
    }

    async componentDidMount() {
        await Font.loadAsync({
          'Satisfy': require('./assets/fonts/satisfy.ttf'),
        });
        this.setState({
            fontLoaded:true
        });
    }

    render(){
    

        return (
            
                <ImageBackground style={styles.background} source={require("./assets/background_login.png")}>
                <Image source={require("./assets/icon.png")} style={styles.logo}/>       
                {
                this.state.fontLoaded ? (
                    <Animatable.Text animation="flipInX" style={styles.middleText}>Some people care too much.{'\n'}I think it’s called love</Animatable.Text>
                ) : null
                }
               
                <Animatable.View animation={this.state.anim} duration={1500} delay={100.0} style={styles.bottomBar}>
                    
                    <ImageBackground style={styles.imageStyle} source={require("./assets/wave_group.png")} >
                        <TouchableOpacity style={styles.buttonStyle} onPressOut={this._onPressButton}>
                            <Text style={styles.texts}>GETTING STARTED</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                    
                </Animatable.View>
                </ImageBackground>
                
            
        )
    }
}