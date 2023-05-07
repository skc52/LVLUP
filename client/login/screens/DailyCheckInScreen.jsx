import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { dailyCheckInOnAChallenge , getChallengeById, getAllCheckedInMessages, clearMsg} from '../redux/challengeActions';
import { useDispatch, useSelector } from 'react-redux';

const DailyCheckInScreen = ({ route, navigation }) => {
    const { challengeId } = route.params;

    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const [emptyMsg, setEmptyMsg] = useState(false);
    const checkinChallengeHandler = () => {
        if (!message){
            setEmptyMsg(true);
            return;
        }
        else{
            setEmptyMsg(false);

        }
        dispatch(dailyCheckInOnAChallenge(challengeId.toString(), message));
        
    };

    const checkinChallengeState = useSelector((state) => state.challenge);
    const { loading, error, success, message:msg } = checkinChallengeState;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daily Check-In</Text>
            <Text style={styles.subtitle}>Enter your check-in message:</Text>
            <TextInput
                style={styles.textInput}
                value={message}
                onChangeText={setMessage}
                multiline={true}
                placeholder="Type your message here..."
            />
            {/* <Button title="Check-In"  onPress={checkinChallengeHandler} disabled={loading} />
            <Button color={"red"} title="Cancel" onPress={()=>navigation.navigate("challenge")} disabled={loading} /> */}


            <View style={styles.buttonContainer}>
  <TouchableOpacity style={[styles.button, styles.checkInButton]} onPress={checkinChallengeHandler} disabled={loading}>
    <Text style={styles.buttonText}>Check-In</Text>
  </TouchableOpacity>
  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => {    dispatch(getChallengeById(challengeId.toString()))  ;
      dispatch(getAllCheckedInMessages(challengeId.toString()));
      dispatch(clearMsg());

      navigation.navigate('challenge')}} disabled={loading}>
    <Text style={styles.buttonText}>Go Back</Text>
  </TouchableOpacity>
</View>
            {error && <Text style={styles.error}>{error}</Text>}
            {emptyMsg && 
            <Text style={styles.error}>Enter your check in message</Text>}
            <Text style={styles.error}>{msg}</Text>

            {success && <Text style={styles.success}>Check-In Successful!</Text>}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        marginTop:50,
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 5,
    },
    textInput: {
      height: 100,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    error: {
      color: "red",
      marginTop: 10,
    },
    success: {
      color: "green",
      marginTop: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
      },
      button: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 14,
        marginHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
      },
      checkInButton: {
        backgroundColor: "#4CAF50",
      },
      cancelButton: {
        backgroundColor: "#FF5722",
      },
      buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },  });
  

export default DailyCheckInScreen;
