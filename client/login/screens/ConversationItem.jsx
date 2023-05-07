import React from 'react'
import { View, Text , TouchableOpacity, Image} from 'react-native'
import {COLORS, FONT, SIZES, SHADOWS} from './Colors'
import Dummy from "../images/dummyprofile.png"
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native';
import { fetchConversation } from '../redux/messageActions'
const ConversationItem = ({user}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const showConversationHandler = () => {
       
    }
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
        
        onPress={showConversationHandler}

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
                {user.lastMessage}
            </Text>
      </View>

    </TouchableOpacity>
  )
}

export default ConversationItem