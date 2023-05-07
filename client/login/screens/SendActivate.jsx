import { View, Text, TextInput, TouchableOpacity, StyleSheet  } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Button} from "react-native-paper"
import { useDispatch, useSelector } from 'react-redux'
import {  sendActivateOtp} from '../redux/actions'

const SendActivate = ({navigation}) => {
    const {user} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const sendActivate = () => {
        dispatch(sendActivateOtp());
        navigation.navigate("activateAcc");

        
    }   
    useEffect(()=>{
        if (!user){
            navigation.navigate("login");
        }
      
    }, [ dispatch])
  return (
    <View style = {{
        flex:1,
        backgroundColor:"#fff",
        alignItems:"center",
        justifyContent:"center",
    }}
    >
    

    <View style = {{width:"70%"}}>
      
       

        <Button
            style = {Styles.btn}
            onPress = {sendActivate}
        >
            <Text style = {{color:"#fff"}}>Send Activate OTP</Text>
        </Button>

    </View>
    </View>
  )
}

export default SendActivate

const Styles = StyleSheet.create({
   
    
    input:{
        backgroundColor:"#fff",
        borderWidth:1,
        borderColor:"#b5b5b5",
        padding:10,
        paddingLeft:15,
        marginVertical:15,
        fontSize:15

    }
    ,
    btn:{
        backgroundColor:"#900",
        padding:5,
    
    }
})