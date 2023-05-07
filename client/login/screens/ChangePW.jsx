import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Button} from "react-native-paper"
import { useDispatch, useSelector } from 'react-redux'
import { changePw } from '../redux/actions'

const ChangePw = () => {

    const dispatch = useDispatch();
    const [opw, setOpw] = useState("");
    const [pw, setPw] = useState("");
    const [cpw, setCpw] = useState("");

    const changePwHandler = () => {
        // call action
        if (pw !== cpw){
            console.log("Passwords do not match")
        }

        dispatch(changePw(opw, pw));

        

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
        Change Password
    </Text>

    <View style = {{width:"70%"}}>
    <TextInput
            secureTextEntry
            style = {Styles.input}
            placeholder='Old Password'
            value={opw}
            onChangeText={setOpw}
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
            onPress = {changePwHandler}
        >
            <Text style = {{color:"#fff"}}>Change Password</Text>
        </Button>

    </View>
    </View>
  )
}

export default ChangePw

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