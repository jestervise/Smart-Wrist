import React,{Component} from 'react'
import {TouchableOpacity,Alert,FlatList,View,TouchableWithoutFeedback} from 'react-native'
import { Button,Text, } from 'react-native-elements';
import {toggleContactListOff} from '../redux/actions'
import {connect} from 'react-redux'
import {Overlay} from 'react-native-elements'
import * as Animatable from 'react-native-animatable'
import store from '../redux/store'
import Icon from '@expo/vector-icons/Ionicons';

export let caregiver;

 class ContactList extends Component{
    contact=this.props.contact


    render(){

        return(
            <Overlay
            isVisible={store.getState().toggleContactList.isHidden} animationIn="bounceInUp" 
            animationOut="bounceOutDown" overlayStyle={{borderRadius:10}}  overlayBackgroundColor="#FF412E"
            >
            
            <Contacts contact={this.contact} toggleContactListOff={this.props.toggleContactListOff}/>
            {/* <Text>
                'Your first contact is...',
                `Name: ${this.contact.data[0].name}\n` +
                `Phone numbers: ${this.contact.data[0].phoneNumbers[0].number}\n` +
                `Emails: ${this.contact.data[0].emails[0].email}`
            </Text> */}
            <Button title="Close" type="outline" titleStyle={{color:'white'}} containerStyle={{borderColor:'white',borderWidth:1,borderRadius:20}}
            onPress={()=>{this.props.toggleContactListOff()}}/>
            </Overlay>  
        )
       
    }
   
}


class Contacts extends React.PureComponent{
    constructor(props){
        super(props)
        this._onPressItems= this._onPressItems.bind(this)
    }
    x=0;
    _keyExtractor =(item,index)=>item.id

     _onPressItems(number,email){
        console.log(number +email)
        return "xd"
    }
   
    // (item.phoneNumbers[0].number,item.emails[0].email)
    _renderItem=({item,index})=>{
       
        return (
        <ContactDetails
        onPressItems={this._onPressItems}
        item={item}
        index={index}
        toggleContactListOff={this.props.toggleContactListOff}
        />
        )
       
    }

   

    render(){
    return <FlatList
        data={this.props.contact.data}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        />
    }
}

class ContactDetails extends React.PureComponent{
    detailsStack=[]
    state={show:true,display:'none'}
    showContactDetails=()=>{
    let number =this.props.item.phoneNumbers[0].number;
        if(this.state.show!=false){
            //this.props.item.emails[0].email?this.detailsStack.push( this.props.item.emails[0].email):null;
            number?this.detailsStack.push( number):null;
            this.detailsStack=this.detailsStack.map((x)=><Animatable.Text easing='ease-out' animation="fadeInLeft">{x}</Animatable.Text>);
            this.detailsStack.push(<SetContact toggleContactListOff={this.props.toggleContactListOff} phoneNumbers={number}/>)
            this.setState({show:!this.state.show})
           
        }else{
            this.detailsStack=[]
            this.setState({show:!this.state.show})
        }
    }
    render(){
        return (
            <TouchableOpacity 
            onPress={this.showContactDetails} 
            style={{justifyContent:'center',alignItems:'center',padding:10}}>
                <Text style={{fontSize:15,fontWeight:'bold',color:'white'}}>{this.props.item.name}</Text>
                <View style={{justifyContent:'center',flexDirection:'row',alignItems:'flex-start',width:'100%'}}>
                {this.detailsStack}
                </View>
            </TouchableOpacity> )
    }
   
}

const Toucher = Animatable.createAnimatableComponent(TouchableWithoutFeedback);

class SetContact extends Component{

    parseContact=()=>{
        this.props.toggleContactListOff();
        caregiver=this.props.phoneNumbers;
    }

    render(){
       return(
        <Toucher animation="bounceIn">
            <TouchableOpacity  style={{position:'absolute',right:10}} onPress={this.parseContact}>
                <Icon name="md-checkmark" size={20} color="white"/>
            </TouchableOpacity>
        </Toucher>
       )
    }
}

function mapDispatchToProps(dispatch){
    return {
        toggleContactListOn: () => {
            dispatch(toggleContactListOn());
        },
        toggleContactListOff:()=>{
            dispatch(toggleContactListOff());  
        }
    }
}

function mapStateToProps(state){
    return state;
}

export default connect(mapStateToProps,mapDispatchToProps)(ContactList);
