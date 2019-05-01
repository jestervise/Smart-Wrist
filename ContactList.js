import React,{Component} from 'react'
import Modal from 'react-native-modal'
import {TouchableOpacity,Alert,FlatList,View} from 'react-native'
import { Button,Text, } from 'react-native-elements';
import {toggleContactListOff} from './redux/actions'
import {connect} from 'react-redux'
import store from './redux/store'
 class ContactList extends Component{
    contact=this.props.contact


    render(){

        return(
            <Modal style={{margin:100,flex:1,position:'absolute',width:'100%',height:'50%',backgroundColor:'white'}} 
            isVisible={store.getState().toggleContactList.isHidden} animationIn="bounceInUp" animationOut="bounceOutDown"  
            >
            <View style={{flex:1}}>
            <Text>
                'Your first contact is...',
                `Name: ${this.contact.data[0].name}\n` +
                `Phone numbers: ${this.contact.data[0].phoneNumbers[0].number}\n` +
                `Emails: ${this.contact.data[0].emails[0].email}`
            </Text>
            </View>
            <Button title="Close" type="outline" onPress={()=>{this.props.toggleContactListOff()}}/>
            </Modal>  
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
