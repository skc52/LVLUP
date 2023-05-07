import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Button} from "react-native-paper"
import { useDispatch, useSelector } from 'react-redux'
import { sendResetEmail } from '../redux/actions'

const EmailReset = ({navigation}) => {
    const {success} = useSelector((state)=>state.pw)
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    const resetEmailHandler = () => {
        // call action
        dispatch(sendResetEmail(email));

    }  
    
    useEffect(()=>{
        if (success){
            navigation.navigate("resetPw", {email:email})

        }
    }, [success])

  return (
    <View style = {{
        flex:1,
        backgroundColor:"#fff",
        alignItems:"center",
        justifyContent:"center",
    }}
    >
    <Text style= {{fontSize:20, margin:20}}>
        Sent Reset OTP
    </Text>

    <View style = {{width:"70%"}}>
   
        <TextInput
            style = {Styles.input}
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
        />
        
       

        <Button
            disabled = {!email}
            style = {Styles.btn}
            onPress = {resetEmailHandler}
        >
            <Text style = {{color:"#fff"}}>Send OTP</Text>
        </Button>

    </View>
    </View>
  )
}

export default EmailReset

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