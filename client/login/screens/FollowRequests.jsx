import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList} from 'react-native'
import React, { useEffect, useState } from 'react'
import {Button} from "react-native-paper"
import { useDispatch, useSelector } from 'react-redux'
import { getAllFollowRequests } from '../redux/actions'
import {COLORS, FONT, SIZES, SHADOWS} from './Colors'
import FollowRequestItem from './FollowRequestItem.jsx';

const FollowRequests = ({navigation}) => {
    const {user} = useSelector((state)=>state.auth)
    const {users} = useSelector((state)=>state.users)
    
    const dispatch = useDispatch();
    const handleNavigate = () => {
        // dispatch(getAUser(user.id));
    }

    useEffect(()=>{
        console.log("Loading all friend requests")
        dispatch(getAllFollowRequests())
    },[])
  return (
    <View
        
    >
        <Text>
            Follow Requests
        </Text>
        <FlatList
                data={users}
                renderItem={({ item }) => (
                    <FollowRequestItem
                        user={item}
                        navigation = {navigation}
                       
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: SIZES.medium, rowGap: SIZES.medium }}
                ListHeaderComponent={() => (
                    <>
                       
                    </>
                )}
                ListFooterComponent={() => (
                    <>
                    </>
                )}
            />
    </View>
  )
}

export default FollowRequests

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