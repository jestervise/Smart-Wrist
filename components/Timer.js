import React, { Component } from 'react';
import { View, Text, TextInput, DatePickerAndroid, TimePickerAndroid, Platform, 
    TouchableOpacity, FlatList, Animated, Easing,Dimensions,ImageBackground } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { TimerCircle } from './SvgShapes';
import firebase from './firebaseconfig';
import { LinearGradient, Font } from 'expo';
import { Overlay, Button as RNButton } from 'react-native-elements';
import { AddTimer } from '../functions/AddTimer';
import { writeUserData } from '../functions/writeUserData';
import { createCalenderEvent } from '../functions/createCalenderEvent';
import { initializeFirebaseTimer } from './Home';
import { timerObject, FonTelloIcon } from './Home';
var { height, width } = Dimensions.get("window");

export class Timer extends Component {
  colors = [/* yellow orange */["#FFC73B", "#FF603B"], /* Default orange red */['#FA9014', '#FF5050'],
        /* yellow orange */["#eaafc8", "#654ea3"], /* blueish */["#29FFB4", "#5A28FF"], /* light yellow orange */["#FF4B2B", "#FF416C"],
        ["#00B4DB","#0083B0"],["#FFFDE4","#005AA7"],["#a2ab58","#636363"],["#ad5389","#3c1053"],["#a8c0ff","#3f2b96"]];
  constructor(props) {
    super(props);
    //Get the timer details from database
    initializeFirebaseTimer();
    this.state = {
      renderText: timerObject.length,
      fontLoaded: false,
      showButton: true,
      endAnim: false,
      killButton: false,
      checkOutButtonProgress: new Animated.Value(0),
      backgroundGradient: ['#FA9014', '#FF5050'],
    };
    this._ChangeBackgroundColor = this._ChangeBackgroundColor.bind(this);
    this.AddTimer = this.AddTimer.bind(this);
  }
  comp;
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
          this.AddAlarmAnimation().then(writeUserData(uid, day, month + 1, year, hour, minute));
        }
      }
    }
  }
  //Hide the addbutton and play tick animation
  //When animation done, kill the button
  async AddAlarmAnimation() {
    this.setState({ showButton: false });
    return await Animated.timing(this.state.checkOutButtonProgress, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      delay: 500
    }).start(() => {
      this.setState({ showButton: true, killButton: true });
    });
  }
  //Load the add button when loaded ,display
  async componentWillMount() {
    Font.loadAsync({
      "c": require('../assets/fonts/c.ttf')
    }).then(() => this.setState({ fontLoaded: true }));
  }
  _ChangeBackgroundColor() {
    //Get random index of colors array
    let randomNum = this.getRandomInt(this.colors.length);
    //then choose the color which is not the same as previous 
    this.setState((state) => {
      while (this.state.backgroundGradient == this.colors[randomNum]) {
        randomNum = this.getRandomInt(this.colors.length);
      }
      //set the backgroundcolor to the specific color
      return { backgroundGradient: this.colors[randomNum] };
    });
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  render() {
  
    return ( 
     <ImageBackground source={require("../assets/reminderBackground.jpg") } style={{width:'100%',height:'100%'}}>
    <LinearGradient colors={this.state.backgroundGradient} style={{ flex: 1, justifyContent: 'center',opacity:0.7}}>
      <TimerCircle />
      <View style={{ flex: 0.2, alignItems: 'flex-start', padding: 40, }}>
        <View style={{flexDirection:'row', padding:20,justifyContent:'space-around'}}>
          <Text style={{fontWeight:'bold',fontSize:30,color:'white'}}>Reminder</Text>
          <Icon name="md-alarm" size={27} color="white" style={{paddingLeft: 20,elevation:30}}/>
        </View>
      </View>
      <View style={{ flex: 0.8, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', height: '100%' }}>

        {this.state.renderText != 0 ?
          <MultiSelectList data={timerObject} backgroundColor={this.state.backgroundGradient} style={{ justifyContent: 'center', alignItems: 'center' }} DeleteTimer={this.props.DeleteTimer} ChangeBackgroundColor={this._ChangeBackgroundColor} /> :
          this.state.fontLoaded ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', margin: '10%', width: width * 0.8, borderRadius: 20, elevation: 20 }}>
              {this.state.showButton && !this.state.killButton && <TouchableOpacity onPress={this.AddTimer}>
                <FonTelloIcon size={100} name="plus-circled" color="#FF5050" />
              </TouchableOpacity>}
              {!this.state.showButton && <LottieView source={require("../assets/check_mark_success.json")} progress={this.state.checkOutButtonProgress} />}
            </View> :
            null}

      </View>


    </LinearGradient>
   </ImageBackground>
    );
  }
}
class MultiSelectList extends React.PureComponent {
  state = { selected: new Map(), dataSource: timerObject };
  _keyExtractor = (item, index) => item[0];
  DeleteTimer() {
  }
  _onPressItem = (id, index) => {
    const start = timerObject.slice(0, index);
    const end = timerObject.slice(index + 1);
    timerObject.splice(index, 1);
    this.setState({ dataSource: start.concat(end) });
    let useruid = firebase.auth().currentUser.uid;
    firebase.database().ref("users/" + useruid + "/" + id).remove();
  };
  _renderItem = ({ item, index }) => (<MyListItem id={item[0]} onPressItem={this._onPressItem} 
    selected={!!this.state.selected.get(item.id)} date={item[1].date} 
    time={item[1].time} backgroundColor={this.props.backgroundColor} index={index} DeleteTimer={this.DeleteTimer} />);
  _onPressFooterItem = () => {
    AddTimer().then((x) => this.setState({ dataSource: timerObject }));
  };
  onViewableItemsChanged = ({ viewableItems, changed }) => {
    //console.log("Visible items are", viewableItems);
    //if the viewable items change, change the background color
    if (changed[0].isViewable == false) {
      this.props.ChangeBackgroundColor();
    }
  };
  render() {
    console.log(timerObject);
    return (<FlatList data={this.state.dataSource} keyExtractor={this._keyExtractor} 
      renderItem={this._renderItem} horizontal={true} vertical={false} 
      onViewableItemsChanged={this.onViewableItemsChanged} 
      ListFooterComponent={<FooterComponent _onPressFooterItem={this._onPressFooterItem} />} 
      showsHorizontalScrollIndicator={false} />);
  }
}
//Flat list last component
const FooterComponent = (props) => {
  return <TouchableOpacity style={{ top: '30%', justifyContent: 'center', padding: 20, }} onPress={props._onPressFooterItem}>
    <FonTelloIcon size={100} name="plus-circled" color="#fff" />
  </TouchableOpacity>;
};
class MyListItem extends React.PureComponent {
  state = {
    isShow: false,
    date: ""
  };
  _onPress = () => {
    //this.props.onPressItem(this.props.id);
    this.setState({ isShow: !this.state.isShow });
  };
  removeItem = () => {
    this.props.onPressItem(this.props.id, this.props.index);
  };
  render() {
    return (<View style={{
      flex: 1, justifyContent: 'center', alignItems: 'center',
      flexDirection: 'column', backgroundColor: 'white', height: '70%', width: width * 0.8,
      margin: 40, borderRadius: 20, elevation: 20
    }}>

      <View style={{ justifyContent: 'center',alignItems:'center' }}>
        <Text style={{ fontSize: 20,color:this.props.backgroundColor[1] }}>{this.props.date}</Text>
        <Text style={{ fontSize: 20,color:this.props.backgroundColor[1] }}>{this.props.time}</Text>
      </View>

      <TouchableOpacity style={{ marginTop: 20 }} onPress={this.removeItem}>
        <Icon name="md-close-circle" size={35} color={this.props.backgroundColor[1]} />
      </TouchableOpacity>

      <TouchableOpacity onPress={this._onPress} style={{ position: 'absolute', right: 10, top: 10 }}>
        <Icon name="md-create" size={25} color={this.props.backgroundColor[1]} style={{ padding: 10 }} />
      </TouchableOpacity>

      <Overlay isVisible={this.state.isShow} overlayStyle={{opacity:0.9,}} onBackdropPress={this._onPress} style={{ justifyContent: 'center', alignItems: 'center', }}>
        <View style={{ justifyContent: 'center' }}>
          <TextInput onFocus={async () => {
            const { action, year, month, day } = await DatePickerAndroid.open();
            if (action != DatePickerAndroid.dismissedAction)
              this.setState({ date: day + "/" + month + "/" + year });
          }} value={this.state.date} placeholder="Please choose the date" style={{ padding: 20 }} />
          <RNButton buttonStyle={{backgroundColor:this.props.backgroundColor[1]}} title={"CLOSE"} onPress={this._onPress} raised={true}/>
        </View>
      </Overlay>
    </View>);
  }
}
