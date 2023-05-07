import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConversation, sendMessage } from '../redux/messageActions.js';
import Message from './Message.jsx';

const Conversation = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const { user } = useSelector(state => state.auth);
  const { conversation } = useSelector(state => state.message);
  const {recipient} = route.params;

  useEffect(() => {
    dispatch(fetchConversation(recipient));
  }, [dispatch, recipient]);

  const handleSend = () => {
    dispatch(sendMessage(recipient, text, user.name));
    setText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversation}
        keyExtractor={message => message._id}
        renderItem={({ item }) => <Message message={item} />}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type your message"
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    marginTop:50
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#eee'
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#007aff'
  },
  sendButtonText: {
    color: '#fff'
  }
});

export default Conversation;
