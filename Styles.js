import { StyleSheet } from 'react-native';
import {Dimensions} from 'react-native';
var { height, width } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#000',
      },
    background:{
        flex:1, 
        justifyContent: 'flex-end',
        alignItems:'center'
    },
    bottomBar:{
        position:'relative',
        bottom:-height,
        height:'85%',
        width:'100%',
        justifyContent: 'center',
        alignItems: 'stretch',
        
    },
    imageStyle:{
        flex:1,
        justifyContent:'flex-start',
        alignItems:'center',
        width:'100%',

    },
    inputStyle:{
        position:'relative',
        top:'20%',
        height:height*(75/100),
        width:width,
        margin: '10%',
        justifyContent:'space-evenly',
        alignItems:'center',
        
        //Border
      
    },
    buttonStyle:{
        
        alignItems:'center',
        justifyContent:'flex-start',
        padding: '4%',
        paddingLeft:'10%',
        paddingRight:'10%',
        marginTop: '40%',
     
        //Border
        borderRadius: 4,
        borderWidth:3,
        borderColor:'#F2F2F2',
    
        //Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    texts:{
        color:'#fff',
        textAlign:'center',
    },
    middleText:{
        color:'#fff',
        position:'absolute',
        bottom:'25%',
        textAlign:'center',
        fontSize:14,
        fontFamily: 'Satisfy',
    },
    logo:{
       position:'absolute',
       width:100,height:100, 
       top:'10%'     
    }, 
    //Home Screen Styling
    dashboardButtonStyle:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        margin:20,
        padding:20,
        width:'90%',
        backgroundColor:'#fff'
    },
    dashboardTextStyle:{
        overflow:'scroll',
        opacity:0.6
    },
    loginButtonStyle:{
        justifyContent:'center',
        alignItems:'center',
        margin:5,
        width:width/3,
        paddingRight:15,
        paddingLeft:15,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#FF6B6B',
        borderRadius:50,
    },
    textingStyle:{
        fontFamily: 'Satisfy',
        color:'#fff'
    },
    providerSignIn:{
        flexDirection:'row',
        backgroundColor:'#fff',
        padding:15,
        justifyContent:'space-evenly',
        alignItems:'center',
        margin:5,
        color:'#fff',
        borderRadius:50
    }

}           
);