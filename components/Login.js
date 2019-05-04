import React,{Component} from 'react';
import {View,Image,AlertIOS,ToastAndroid,ImageBackground,TouchableOpacity,Text,TextInput,Dimensions,Animated,Button,Platform } from 'react-native';
import styles from '../Styles'
import * as Animatable from 'react-native-animatable';
import {Font} from 'expo';
var { height, width } = Dimensions.get("window");
import firebase from './firebaseconfig'
import Icon from '@expo/vector-icons/Ionicons';
import {accountLoginSuccess,accountLoginFailed} from "../redux/actions"
import { connect } from "react-redux";
import {Facebook} from 'expo';
import {createStackNavigator,createAppContainer} from 'react-navigation'


 
let register = (email,password)=>firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

  });


 class Login extends Component{

    async componentWillMount(){
        await firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              this.props.navigation.navigate('Home');
            }
          }
        )
    }
     

    constructor(props){
        super(props);
        this.state={
            fontLoaded:false,
            isShow:false,
            yTranslate:new Animated.Value(-height),
            loginButtonText:"GETTING STARTED",
        }
        

        this._onPressButton= this._onPressButton.bind(this);
    }

    
    
    AnimatedTranslation(value){
        Animated.timing(
            this.state.yTranslate,
            {
                toValue: 0 +value,
                duration: 800,
            }).start(
                () => {this.view.transitionTo({marginTop: '70%' },1000,'ease-in-out-back');});
    }
    
     _onPressButton(){ 
        
        this.AnimatedTranslation(0); 
        this.setState({loginButtonText:"LOGIN"});
        this.setState({isShow:true});
        console.log("xa")
    }

    async componentDidMount() {

        await Font.loadAsync({
          'Satisfy': require('../assets/fonts/satisfy.ttf'),
        });
        this.setState({
            fontLoaded:true
        });

        this.AnimatedTranslation((-height/2.2));
    }

    handleViewRef = ref => this.view = ref;

    render(){
        let animatedStyle={bottom:this.state.yTranslate};
        
        return (
                <ImageBackground style={styles.background} source={require("../assets/background_login.png")}>
                {
                    this.state.fontLoaded?<Animatable.Image animation="flipInY" source={require("../assets/logo.png")} style={styles.logo}/>:null 
                }
                {
                this.state.fontLoaded?(
                    
                    <Animatable.Text animation="flipInX" style={styles.middleText}>Some people care too much.{'\n'}I think it’s called love</Animatable.Text>
                ):null 
                }
               
                <Animatable.View  style={[styles.bottomBar,animatedStyle]}>
                    
                    <ImageBackground style={styles.imageStyle} source={require("../assets/bottom_bar.png")} >
                        {this.state.isShow && 
                        <LoginPanel accountLoginSuccess={this.props.accountLoginSuccess} accountLoginFailed={this.props.accountLoginFailed} navigation={this.props.navigation}/>}
                        <Animatable.View ref={this.handleViewRef}>
                        <TouchableOpacity style={styles.buttonStyle} onPressOut={this._onPressButton}>
                            <Text style={styles.texts}>{this.state.loginButtonText}</Text>
                        </TouchableOpacity>
                        </Animatable.View>
                    </ImageBackground>
                    
                </Animatable.View>
                </ImageBackground>    
            
        )}
    }

class LoginPanel extends Component {
    constructor(props){
        super(props)
        this.state={
            email:"",
            password:""
        }
        provider = null;
        this.iconGenerator=this.iconGenerator.bind(this);
        this.loginButtonPressed=this.loginButtonPressed.bind(this);
        this.handleEmailValue=this.handleEmailValue.bind(this);
        this.handlePasswordValue=this.handlePasswordValue.bind(this);
        this.providerButtonPressed=this.providerButtonPressed.bind(this)
        this.register= this.register.bind(this);
        this.props.accountLoginFailed = this.props.accountLoginFailed.bind(this);
    }
    

    iconGenerator=(iconName)=><Icon name={iconName} color="#fff" size={18}/>
    loginButtonPressed=()=>{
     
           firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(
            user=>{
                this.props.accountLoginSuccess(user.providerSignIn);
                console.log(this.props.navigation.navigate);    
                this.props.navigation.navigate('Home');
            }            
            )
            .catch(
            (error)=> {
            var errorCode = error.code;
            var errorMessage = error.message;
            this.props.accountLoginFailed(errorCode);
            if(Platform.OS=="android")
                ToastAndroid.show(errorMessage,ToastAndroid.SHORT);
            else
                AlertIOS.alert("Please Try Again",errorMessage);    
          }
        )   
    
        
          
    }

    async providerButtonPressed(e){
        switch(e.target){
            case 63:
           
            break;
        }
        console.log("xd");
        const {type,token} = await Facebook.logInWithReadPermissionsAsync
        ("409965669801114",{permission:[public_profile]});
        if(type=="success"){
            console.log(type);
            const credential = firebase.auth.FacebookAuthProvider.credential(token);
            firebase.auth().signInWithCredential(credential).catch((error)=>{
                console.log(error)
            })
        }else{
            console.log(type);
        }
        /*this.provider=new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(this.provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(errorCode);
        // ...
      });*/
      
    }

    register(){
        //this.props.navigation.navigate("Register");
    }

    handleEmailValue=(text)=>{this.setState({email:text})}    
    handlePasswordValue=(text)=>{this.setState({password:text})}    
        
    render() {
        return (
           
        <Animatable.View style={styles.inputStyle}>
            <TextInput style={{padding:10}} value={this.state.email} onChangeText={this.handleEmailValue} underlineColorAndroid="#fff" placeholder="Enter your email address" placeholderTextColor="#fff"/>
            <TextInput style={{padding:10}} value={this.state.password} onChangeText={this.handlePasswordValue} underlineColorAndroid="#fff" placeholder="Enter your password" placeholderTextColor="#fff" secureTextEntry={true}/>             
            <View style={{justifyContent:'space-evenly',flexDirection: 'row',flexWrap:'wrap',alignItems:'center',width:'100%',padding:2,marginBottom: 50,}}>
            <View style={{width:'100%' ,alignItems:'center',marginBottom:20}}><TouchableOpacity style={styles.loginButtonStyle}  onPress={this.loginButtonPressed}><Text style={styles.texts}>Login</Text></TouchableOpacity></View>
                <TouchableOpacity style={[styles.providerSignIn,{backgroundColor:'#3b5998'}]}  onPress={this.providerButtonPressed}>{this.iconGenerator("logo-facebook")}</TouchableOpacity>
                <TouchableOpacity style={[styles.providerSignIn,{backgroundColor:'#00acee'}]}  onPress={()=>{this.props.navigation.navigate('Home')}}>{this.iconGenerator("logo-twitter")}</TouchableOpacity>
                <TouchableOpacity style={[styles.providerSignIn,{backgroundColor:'#B23121'}]}  onPress={()=>{this.props.navigation.navigate('Home')}}>{this.iconGenerator("md-mail")}</TouchableOpacity>
                <View style={{width:'100%' ,alignItems:'center'}}><TouchableOpacity  onPress={this.register}><Text style={styles.textingStyle}>Doesn't have an account? Register Here</Text></TouchableOpacity></View>
                
            </View>
        </Animatable.View>
        );
    }
    }

class Register extends Component{
    render(){
        return <View><Text>Trying</Text></View>
    }
}    

const registerStack = createStackNavigator(
{
    Login:{
        screen:Login,
        navigationOptions: ({ navigation }) => {
            return {
              header:null
            };
          }
    },
    Register:{
        screen:Register
    }
})

export const AppSwitcher = createAppContainer(registerStack);

function mapDispatchToProps(dispatch){
    return {
        accountLoginSuccess: (provider) => {
            dispatch(accountLoginSuccess(provider));
        },
        accountLoginFailed:(provider)=>{
            dispatch(accountLoginFailed(provider));  
        }
    }
}

function mapStateToProps(state){
    return state;
}

class LoginRegister extends Component {

    render() {
      return <AppSwitch />;
    }
}






export default connect(mapStateToProps,mapDispatchToProps)(Login);
 
