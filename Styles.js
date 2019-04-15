import { StyleSheet } from 'react-native';


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
        height:'40%',
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    imageStyle:{
        flex:1,
        justifyContent:'flex-end',
        alignItems:'center',
        width:'100%'
    },
    buttonStyle:{
        alignItems:'center',
        justifyContent:'flex-start',
        padding: '4%',
        paddingLeft:'10%',
        paddingRight:'10%',
        marginBottom: '10%',
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
        textAlign:'center',
        fontSize:14,
        fontFamily: 'Satisfy',
    },
    logo:{
       position:'relative',
       width:100,height:10, 
       top:'20%'     
    } 

}           
);