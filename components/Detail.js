import React,{Component} from 'react';
import { View, Text,TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons'
import {tempHumid} from "./SvgShapes"
import {Button} from 'react-native-elements'

export class Detail extends Component{
    state={showStatus:"Temperature",unit:"°C",selected:'transparent'}

    _SwitchTab=()=>{
        this.setState({selected:'white'})
    }

    render(){
        return  (
        <View style={{ flex: 1, alignItems: 'stretch',width:'100%', justifyContent: 'center',backgroundColor:'#F55555' }}>
        <TouchableOpacity style={{position:'absolute',top:30,left:10,margin:10}} onPress={()=>{this.props.navigation.navigate('Feed')}}>
            <Icon name="md-arrow-back" size={32} color="white" />
        </TouchableOpacity>
            <TopStatusBar showStatus={this.state.showStatus} unit={this.state.unit}/>
            <BottomReport selected={this.state.selected} SwitchTab={this._SwitchTab}/>
        </View>
      );
    }
}

const TopStatusBar =(props)=>{
    themeColor="white"
    return (
    <View style={{flex:0.5,width:'100%',justifyContent:'flex-end',alignItems:'center'}}>
        <View style={{alignItems:'center',width:'100%'}}>
            <Text style={{fontWeight:'bold',fontSize:45,color:this.themeColor}}>{tempHumid[0]}</Text>
            <Text style={{fontSize:13,color:this.themeColor}}>{props.showStatus}</Text>
            <Text style={{fontSize:13,color:this.themeColor}}>{props.unit}</Text>
            <View style={{width:'30%',marginTop:10,height: "4%",opacity:0.25,borderRadius:10,backgroundColor:this.themeColor}}></View>
            <Icon name="md-help-circle-outline" size={27} color="white" style={{position:'absolute',right:20,bottom:20,marginRight: 45,}} />
        </View>
    </View>
)
}

const BottomReport =(props)=>{
    const TopTabBar=(props)=><Button  title={props.title} buttonStyle={{backgroundColor:'transparent'}} 
    containerStyle={{margin:2,backgroundColor:props.selected,width:'37%',height:'70%',borderWidth:2,borderRadius:0,borderColor:'white'}}
    titleStyle={{fontSize:12.5,textAlign:'center',textAlignVertical:'center'}} onPress={this.buttonOnPress}/>
    
    buttonOnPress=()=>{
        props.SwitchTab();
    }


    return  <View style={{flex:0.6,backgroundColor:'blue',alignItems: 'stretch',width:'100%'}}>
        <View style={{width:'100%',height:'25%',alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
            <TopTabBar title="Temperature & Humidity" id={1} selected={props.selected}/>
            <TopTabBar title="Movement Report" id={2} selected={props.selected}/>
        </View>
        
    </View>
}
