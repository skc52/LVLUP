import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Button} from "react-native-paper"
import { useDispatch, useSelector } from 'react-redux'
import { resetPw } from '../redux/actions'

const ResetPw = ({navigation, route}) => {
    const {isUpdated} = useSelector((state)=>state.pw)
    const dispatch = useDispatch();
    const [pw, setPw] = useState("");
    const [cpw, setCpw] = useState("");
    const [otp, setOtp] = useState();
    const {email} = route.params;
    const resetPwHandler = () => {
        // call action
        if (pw !== cpw){
            console.log("Passwords do not match")
        }
        console.log("email in reset pw is", email)
        dispatch(resetPw(email, otp, pw));

        

    }   

    useEffect(()=>{
        if (isUpdated){
            navigation.navigate("login");
        }
    }, [isUpdated])
  return (
    <View style = {{
        flex:1,
        backgroundColor:"#fff",
        alignItems:"center",
        justifyContent:"center",
    }}
    >
    <Text style= {{fontSize:20, margin:20}}>
        Reset Password
    </Text>

    <View style = {{width:"70%"}}>

        <TextInput
                style = {Styles.input}
                placeholder='RESET OTP'
                keyboardType='numeric'
                value={otp}
                onChangeText={setOtp}
            />
       
   
        <TextInput
            secureTextEntry
            style = {Styles.input}
            placeholder='New Password'
            value={pw}
            onChangeText={setPw}
        />
        <TextInput
            secureTextEntry
            style = {Styles.input}
            placeholder='Confirm Password'
            value={cpw}
            onChangeText={setCpw}
        />
       

        <Button
            disabled = {!pw || !cpw}
            style = {Styles.btn}
            onPress = {resetPwHandler}
        >
            <Text style = {{color:"#fff"}}>Reset Password</Text>
        </Button>

    </View>
    </View>
  )
}

export default ResetPw

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