import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const Message = ({ message }) => {
  const {user } = useSelector((state)=>state.auth)
  useEffect(()=>{
    // console.log(message.sender._id);
  }, [])
  return (
    <View style={message.sender._id?.toString() === user?._id.toString() || message.sender.toString() === user?._id.toString()?  styles.container : styles.container2}>
      <Text style={styles.sender}>{message.sender.name || user.name }</Text>
      <Text style={styles.text}>{message.text}</Text>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
    alignSelf: 'flex-end'
  },
  container2: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start'
  },
 
  sender: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  text: {
    fontSize: 16,
  }
});

export default Message;
