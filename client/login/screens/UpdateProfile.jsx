import { View, Text , StyleSheet, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react'
import { Avatar } from 'react-native-paper'
import {Button} from 'react-native-paper'
import { updateUser, clearUpdate, loadUser } from '../redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import * as FileSystem from 'expo-file-system';
import Loader from '../components/Loader'

const UpdateProfile = ({navigation, route}) => {
    const {isAuthenticated, loading, user, isUpdated} = useSelector((state)=>state.auth);
    // const {isUpdated} = useSelector((state)=>state.updateUser)
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [baseData, setBaseData] = useState("");
    const dispatch = useDispatch();
    const handleImage = () => {
        navigation.navigate("camera", {registerBool:false})
    }

    function isWebLink(str) {
        // regular expression to match a web link
        const webLinkRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        console.log("eibdwi in weblinl", str)
        return webLinkRegex.test(str);
      }

    const updateHandler = async () => {

      
        // const image = {
        //     uri:avatar, 
        //     type:`test/${avatar.split(".")[1]}`,
        //     name:avatar.split("/").pop()
        // };
        
        let avatarUpdateBool = !isWebLink(avatar);
        let base64Image = "";
        if (avatarUpdateBool){
            base64Image = await FileSystem.readAsStringAsync(baseData?.uri, {
                encoding: FileSystem.EncodingType.Base64,
              });
            
        }
        dispatch(updateUser(name, avatar, avatarUpdateBool, base64Image ));   
    }

    useEffect(()=>{
        setName(user.name);
        setAvatar(user.avatar?.url)
        // setAvatar(user.avatar)
        console.log("User is updated")

        if (isUpdated){
            dispatch(clearUpdate());
            navigation.navigate("profile", {profileUser:user, me:true})

        }

       

        

        if (route.params){
            if (route.params.image){
                setAvatar(route.params.image)
                setBaseData(route.params.data)
            }
        }
        
    }, [route, isUpdated])

   
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
            style = {{backgroundColor:"#900"}}
        />

        <TouchableOpacity onPress={handleImage}>
            <Text style= {{color:"#900"}}>Change Photo</Text>
        </TouchableOpacity>

        <View style = {{width:"70%"}}>
            <TextInput
                style = {Styles.input}
                placeholder="Name"
                value = {name}
                onChangeText={setName }
            />
             
            
            <Button
                disabled = {!name}
                style = {Styles.btn}
                onPress = {updateHandler}
            >
                <Text style = {Styles.btnText}>Update</Text>
            </Button>

              
            <Button
                style = {Styles.btn}
                onPress = {()=>navigation.navigate("profile", {profileUser:user, me:true})}
            >
                <Text style = {{color:"red"}}>Cancel</Text>
            </Button>

            {isUpdated && <Loader/>}
            

        </View>


    </View>
  )
}

export default UpdateProfile


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
    
   
    ,btn: {
        backgroundColor: "#eee",
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        width: "100%",
        alignItems: "center",
      },
      btnText: {
        color: "green",
        fontSize: 16,
        margin: 5,
        textAlign: "center",
      },
})