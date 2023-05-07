import { View, Text , StyleSheet, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react'
import { Avatar } from 'react-native-paper'
import {Button} from 'react-native-paper'
import { registerUser } from '../redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import * as FileSystem from 'expo-file-system';

const Register = ({navigation, route}) => {
    const {isAuthenticated} = useSelector((state)=>state.auth);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");
    const [baseData, setBaseData] = useState("");
    const dispatch = useDispatch();
    const handleImage = () => {
        navigation.navigate("camera", {registerBool:true})
    }

    const registerHandler = async () => {

      
        // const image = {
        //     uri:avatar, 
        //     type:`test/${avatar.split(".")[1]}`,
        //     name:avatar.split("/").pop()
        // };
        

        const base64Image = await FileSystem.readAsStringAsync(baseData.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          console.log(base64Image)
        
        dispatch(registerUser(email, password, name, base64Image));
        
        
    }

    useEffect(()=>{
        if (route.params){
            if (route.params.image){
                console.log(route.params.image)
                setAvatar(route.params.image)
                setBaseData(route.params.data)
            }
        }
        if (isAuthenticated){
            navigation.navigate("sendActivate");
        }
    }, [route])
  return (
    <View
        style = {{
            flex:1,
            backgroundColor:"#fff",
            alignItems:"center",
            justifyContent:"center"
        }}
    >

        <Avatar.Image
            size= {100}
            source = {{uri:avatar? avatar:null}}
            style = {{backgroundColor:"#aaa"}}
        />

        <TouchableOpacity onPress={handleImage}>
            <Text style= {{color:"#aaa"}}>Change Photo</Text>
        </TouchableOpacity>

        <View style = {{width:"70%"}}>
            <TextInput
                style = {Styles.input}
                placeholder="Name"
                value = {name}
                onChangeText={setName }
            />
              <TextInput
                style = {Styles.input}
                placeholder="Email"
                value = {email}
                onChangeText={setEmail }
            />
             <TextInput
                secureTextEntry
                style = {Styles.input}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
            />

            
            <Button
                disabled = {!email||!password ||!name}
                style = {Styles.btn}
                onPress = {registerHandler}
            >
                <Text style = {{color:"#aaa"}}>Register</Text>
            </Button>
            <TouchableOpacity onPress={()=>navigation.navigate("login")}>
                <Text
                    style = {{
                        color:"#abb",
                        height:30,
                        margin:20,
                        textAlign:"center"
                    }}
                >
                    Have an Account? Log In
                </Text>
            </TouchableOpacity>

        </View>


    </View>
  )
}

export default Register


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