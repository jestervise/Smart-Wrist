import React,{Component} from 'react'
import Icon from '@expo/vector-icons/Ionicons'
import {TouchableOpacity,Alert,FlatList,View} from 'react-native'
import {Contacts,Permissions} from 'expo'
import {connect} from 'react-redux'
import {toggleContactListOn} from '../redux/actions'
import { Button,Text, } from 'react-native-elements';
import ContactList from './ContactList'



let x=0;
class Call extends Component{
    contact
    constructor(props){
        super(props);
        this.state={
            isVisible:true
        }
        this.OpenContact=this.OpenContact.bind(this);
    }


    async OpenContact(){
        //Ask for get contact permission 
        const {status}=await Permissions.askAsync(Permissions.CONTACTS);
        //If success
        if(status==='granted'){
            //Get the permission and...
            return  Permissions.getAsync(Permissions.CONTACTS).then((x)=>{
                //not granted prompt to enable permission
                if(x.status!=='granted'){
                    console.log(x);
                    Alert.alert("Please enable permission for accessing phone contacts");
                }
                else{
                    //else get phone contact with formats
                    Contacts.getContactsAsync({
                        fields: [
                          Contacts.PHONE_NUMBERS,
                          Contacts.EMAILS,
                        ],
                        pageSize: 10,
                        pageOffset: 0,
                      }).
                    then(
                        (contact)=>{
                            //Then prompt user the contacts
                            if(this.contact==undefined)
                                this.contact=<ContactList contact={contact}/>
                            this.props.toggleContactListOn();
                            
                            
                           
                            
                        }
                        ).catch((error)=>{
                    console.log(error);
                })
                } 
                
                }).
                catch((error)=>{console.log(error)});
        }else{
            Alert.alert("Please enable contact access permission")
        }
        
      
    }

   

    render(){
        return <TouchableOpacity style={{position:'relative',alignSelf:'flex-end',right:"20%"}} onPress={this.OpenContact}> 
        <Icon name="md-call" size={18} color="#fff" />
         { this.contact}
         </TouchableOpacity>
         
    }
}

function mapDispatchToProps(dispatch){
    return {
        toggleContactListOn: () => {
            dispatch(toggleContactListOn());
        }
    }
}

function mapStateToProps(state){
    return state;
}

export default connect(mapStateToProps,mapDispatchToProps)(Call);


// modal =()=><Modal isVisible={this.state.isVisible} animationIn="bounceInUp" animationOut="bounceOutDown">
// <View>
//     {console.log("???")}
//     <Text>
//         'Your first contact is...',
//         `Name: ${contact.data[0].name}\n` +
//         `Phone numbers: ${contact.data[0].phoneNumbers[0].number}\n` +
//         `Emails: ${contact.data[0].emails[0].email}`
//     </Text>
// </View>
// <Button title="Close" type="outline" onPress={()=>this.setState({isVisible:false})}></Button>
// </Modal>  