import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Button} from "react-native-paper"
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/actions'


const Settings = ({navigation}) => {
    const dispatch = useDispatch();
    const logoutHandler = () => {
        dispatch(logout());
        navigation.navigate("login")
    }
    const updateProfileHandler = () => {
        
    }

    const deleteProfileHandler = () => {

    }

  return (
    <View style={styles.container}>
  <TouchableOpacity onPress={() => navigation.navigate("changePw")}>
    <Text style={styles.buttonText}>Change Password</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.button} onPress={logoutHandler}>
    <Text style={styles.buttonText}>Log Out</Text>
  </TouchableOpacity>
  {/* <TouchableOpacity style={styles.button} onPress={updateProfileHandler}>
    <Text style={[styles.buttonText, { color: "green" }]}>Update Profile</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.button} onPress={deleteProfileHandler}>
    <Text style={[styles.buttonText, { color: "red" }]}>Delete Account</Text>
  </TouchableOpacity> */}
</View>
  )
}

export default Settings

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      flexDirection:"row"
    },
    button: {
      backgroundColor: "#eee",
      borderRadius: 5,
      padding: 10,
      marginVertical: 5,
      width: "60%",
      alignItems: "center",
    },
    buttonText: {
      color: "#333",
      fontSize: 16,
      margin: 5,
      textAlign: "center",
    },
  });
  