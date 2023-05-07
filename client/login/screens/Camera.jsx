import React from 'react'
import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from "expo-image-picker"

const CameraComponent = ({navigation, route}) => {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [camera, setCamera] = useState(null);
    const {registerBool } = route.params;

    const  openImagePickerAsync= async() => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult){
            alert("Permission to access camera roll is required");
            return;
        }

        const data = await ImagePicker.launchImageLibraryAsync({
            allowsEditing:true, aspect:[1,1], quality:1 ,canceled: true,
        })

        return navigation.navigate("register", {image:data.uri, data:data})
        
    }
    const  openImagePickerAsyncUpdate= async() => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult){
          alert("Permission to access camera roll is required");
          return;
      }

      const data = await ImagePicker.launchImageLibraryAsync({
          allowsEditing:true, aspect:[1,1], quality:1,canceled: true,
      })

      return navigation.navigate("updateProfile", {image:data.uri, data:data})
      
  }

    const clickPicture = async() => {
        const data = await camera.takePictureAsync();
       
        return navigation.navigate("register", {image:data.uri, data:data})
    }

    const clickPictureUpdate = async() => {
      const data = await camera.takePictureAsync();
     
      return navigation.navigate("updateProfile", {image:data.uri, data:data})
  }
    
    if (!permission) {
      // Camera permissions are still loading
      return <View />;
    }
  
    if (!permission.granted) {
      // Camera permissions are not granted yet
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }
  
    function toggleCameraType() {
      setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }
  
    return (
      <View style={styles.container}>
        <Camera style={{flex:1, aspectRatio:1}} ratio='1:1' type={type} ref={(e)=>setCamera(e)} />
          <View 
            style = {{
                flexDirection:"row",
                position:"absolute",
                bottom:10,
                justifyContent:"space-evenly",
                width:"100%"
            }}
          >
            <Icon name = "image" size = {40} color = "#fff" onPress={registerBool?openImagePickerAsync:openImagePickerAsyncUpdate} />
            <Icon name = "camera" size = {40} color = "#fff" onPress={registerBool?clickPicture:clickPictureUpdate} />
            <Icon name = "flip-camera-android" color = "#fff" size = {40} onPress={()=>setType(
                type === CameraType.back? CameraType.front : CameraType.back
            )} />
          </View>
       
      </View>
    );
}

export default CameraComponent

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });