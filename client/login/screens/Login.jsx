import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Button} from "react-native-paper"
import { useDispatch, useSelector } from 'react-redux'
import { login , clearReset} from '../redux/actions'

const Login = ({navigation}) => {

    const {isAuthenticated, user, loading, error} = useSelector(state=>state.auth);
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = () => {
        console.log("TRYING TO LOGIN")
      dispatch(login(email, password));

    }

    useEffect(()=>{


        if (isAuthenticated && user?.isActivated){
            navigation.navigate("profile", {profileUser:user})
        }

        if (user && !user.isActivated){
            navigation.navigate("sendActivate")
        }

        if (error){
            alert(error); 
        }
        dispatch({type:"clearError"})
    }, [error, dispatch, alert, isAuthenticated])
  return (
    <View
        style = {{
            flex:1,
            backgroundColor:"#fff",
            alignItems:"center",
            justifyContent:"center",
        }}
    >
        <Text style= {{fontSize:20, margin:20}}>
            WELCOME
        </Text>

        <View style = {{width:"70%"}}>
            <TextInput
                style = {Styles.input}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                secureTextEntry
                style = {Styles.input}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
            />

            <Button
                disabled = {!email||!password}
                style = {Styles.btn}
                onPress = {loginHandler}
            >
                <Text style = {{color:"#aaa"}}>Login</Text>
            </Button>

            <Text
                style= {{
                    marginTop:20,
                    textAlign:"center"
                }}
            >
                Or
            </Text>

            <TouchableOpacity onPress={()=>navigation.navigate("register")}>
                <Text
                    style = {{
                        // color:"#900",
                        height:30,
                        margin:20,
                        textAlign:"center"
                    }}
                >
                    Sign Up
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{dispatch(clearReset());console.log("forgot pw press");navigation.navigate("emailReset")}}>
                <Text
                    style = {{
                        color:"#900",
                        height:30,
                        margin:20,
                        textAlign:"center"
                    }}
                >
                    Forgot Password?
                </Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default Login


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
        backgroundColor: "#eee",
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        width: "100%",
        alignItems: "center",
    
    }
})