import { View, Text } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'
/*=============================================================
Loader Component
DESCRIPTION
    The loader component.
PARAMETERS
    None.
RETURNS
    A React Native component for displaying a loading indicator.
=============================================================*/

const Loader = () => {
  return (
    <View
        style = {{
            backgroundColor:'#fff',
            flex:1,
            justifyContent:"center",
            alignItems:"center"
        }}
    >
        <ActivityIndicator animating= {true} size={100} color='#900' />
    </View>
  )
}

export default Loader