import { View, Text, SafeAreaView, Platform, StatusBar , StyleSheet} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
/*=============================================================
Home
DESCRIPTION
    This component represents the home screen of the application.
    It may display posts and challenges from all users.
PARAMETERS
    None.
RETURNS
    A React Native component for the home screen.
=============================================================*/

const Home = () => {
    const navigation = useNavigation();
  return (
    <View style = {{backgroundColor:"#fff", flex:1, paddingTop:Platform.OS==="android"? StatusBar.currentHeight:0}}>
        {/* safeareaview only works for ios */}
        <SafeAreaView>
             <Text style={styles.heading}>HOME</Text>

            <Text onPress={()=>navigation.navigate("login")}>LOGIN</Text>

        </SafeAreaView>
    </View>
  )
}

export default Home


const styles = StyleSheet.create({
    heading:{
        fontSize:28,
        textAlign:"center",
        marginTop:25,
        marginBottom:20,
        color:"#fff",
        backgroundColor:"#474747"
    },
    
})