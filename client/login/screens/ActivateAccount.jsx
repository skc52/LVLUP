import { View, Text, TextInput, TouchableOpacity, StyleSheet  } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Button} from "react-native-paper"
import { useDispatch, useSelector } from 'react-redux'
import { activateAccount } from '../redux/actions'

const ActivateAccount = ({navigation}) => {
    const {user} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const [otp, setOtp] = useState();
    const activateHandler = () => {
       dispatch(activateAccount(otp));
       navigation.navigate("profile", {profileUser:user})
    }   
  return (
    <View style = {{
        flex:1,
        backgroundColor:"#fff",
        alignItems:"center",
        justifyContent:"center",
    }}
    >
    <Text style= {{fontSize:20, margin:20}}>
        ACTIVATE ACCOUNT
    </Text>

    <View style = {{width:"70%"}}>
        <TextInput
            style = {Styles.input}
            placeholder='OTP'
            keyboardType='numeric'
            value={otp}
            onChangeText={setOtp}
        />
       

        <Button
            disabled = {!otp}
            style = {Styles.btn}
            onPress = {activateHandler}
        >
            <Text style = {{color:"#fff"}}>Activate Account</Text>
        </Button>

    </View>
    </View>
  )
}

export default ActivateAccount

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