import React, { useEffect, useState } from 'react'
import { View, Text , TouchableOpacity, Image, StyleSheet} from 'react-native'
import {COLORS, FONT, SIZES, SHADOWS} from './Colors'
import Dummy from "../images/dummyprofile.png"
import { useDispatch , useSelector} from 'react-redux'
import { Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import { getAUser, acceptFollowRequest, clearAcceptSuccess, getAllFollowRequests  } from '../redux/actions'
const FollowRequestItem = ({user}) => {
  const {acceptReqSuccess} = useSelector((state)=>state.follow)
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const showProfileHandler = () => {
        dispatch(getAUser(user.id));
        navigation.navigate("profile", {profileUser:user, me:false} )
    }
    const [btnText, setBtnText] = useState("Accept");
    const acceptRequestHandler  = () => {
        // TODO CHECK THIS WORKS
        console.log("hewidwin accept handler")
        dispatch(acceptFollowRequest(user._id));
        setBtnText("Accepted");
    }

    useEffect(()=>{
      if (acceptReqSuccess ){

        dispatch(getAllFollowRequests())
        dispatch(clearAcceptSuccess());
      }

    }, [acceptReqSuccess])
  return (
    <TouchableOpacity
      style = {{flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        padding: SIZES.medium,
        borderRadius: SIZES.small,
        backgroundColor: "#FFF",
        ...SHADOWS.medium,
        shadowColor: COLORS.white,}}
        
        onPress={showProfileHandler}

    >
      <TouchableOpacity style = {{ width: 50,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",}}>
          <Image
            source={{uri: user.avatar?.url?user.avatar.url:"https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg"}}
            resizeMode='contain'
            style= {{  width: "70%",
            height: "70%",}}
          />
      </TouchableOpacity>

      
      <View style = {{flex: 1,
    marginHorizontal: SIZES.medium,}}>
        <Text style = {{   fontSize: SIZES.medium,
   
    color: COLORS.primary,}} numberOfLines={1}>
          {user.name}
        </Text>
      
      </View>

      <Button
                
                style = {Styles.btn}
                onPress = {acceptRequestHandler}
            >
                <Text style = {{color:"#fff"}}>{btnText}</Text>
            </Button>

    </TouchableOpacity>
  )
}

export default FollowRequestItem

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