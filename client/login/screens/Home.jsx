import { View, Text, SafeAreaView, Platform, StatusBar , StyleSheet} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

// this is where all the posts and challenges will be shown from all users
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