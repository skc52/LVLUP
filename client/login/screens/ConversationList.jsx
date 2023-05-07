// ConversationListScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConversationList } from '../redux/messageActions.js';
import { getNoMessageUsers } from '../redux/actions.js';
import Loader from "../components/Loader.jsx"
import {COLORS, FONT, SIZES, SHADOWS} from './Colors'
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign'


const ConversationListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { conversationList, isLoading, error } = useSelector(
    (state) => state.conversationList
  );


  const [searchName, setSearchName] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      // Your code here that you want to run when the component comes into focus
      dispatch(fetchConversationList("")); 
      console.log("HERE IN FETCHING CONVO LIST");
  
      return () => {
        // Optional cleanup code that you want to run when the component loses focus
      };
    }, []) // Empty dependency array ensures that the effect runs only once when the component is mounted
  );
  useEffect(() => {
    dispatch(fetchConversationList("")); 

  }, [dispatch]);

  const showConvoHandler = (id) => {
    // dispatch(getAUser(user.id));
    console.log(id, "from");
    navigation.navigate("conversation", {recipient:id} )
  }
  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
    style = {{flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      padding: SIZES.medium,
      borderRadius: SIZES.small,
      backgroundColor: "#FFF",
      ...SHADOWS.medium,
      shadowColor: COLORS.white,
      marginBottom:10
    }}

      
      onPress={()=>{ console.log(item, "ITEM"); showConvoHandler(item.id)}}
    >   
       <View style={styles.conversationItem}>
      <Text style={styles.senderName}>{item.name}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage}</Text>
    </View>
    </TouchableOpacity>

  );

  
  

  if (isLoading) {
    return <Loader/>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const searchHandler = () => {
    dispatch(fetchConversationList(searchName)); 

  }

  const goToNewMessageScreen = () => {
    //
    dispatch(getNoMessageUsers())
    navigation.navigate("newMessage");
  }

  return (
    <View  style = {
      styles.container
    }>
      { conversationList.length === 0 &&
     <Text>No conversations Yet</Text>}

  

      <View style = {styles.containerTop}>
        <TouchableOpacity style = {styles.button} onPress={goToNewMessageScreen}>
          <Text style = {styles.buttonText}>
             New Message
          </Text>
        </TouchableOpacity>

      
      <View style = {styles.searchContainer}>
            <TextInput
                style = {styles.input}
                placeholder='Search user'
                value={searchName}
                onChangeText={setSearchName}
            />

            <TouchableOpacity  onPress={searchHandler} style = {styles.searchIcon}>
                <Icon name = "search1" size = {30} color = "#980" />
            </TouchableOpacity>  

           
        </View>
        </View>
    
    <FlatList
      data={conversationList}
      keyExtractor={(item) => item._id}
      renderItem={renderConversationItem}
      style = {{width:"90%"}}
     
    />

</View>
    // <Text>CONVERSATIONS</Text>
  );
};

const styles = StyleSheet.create({
  conversationItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  lastMessage: {
    color: '#777'
  },
  container: {
    marginVertical: 150,    
    alignItems: 'center',
  },
  searchContainer: {
    width: '70%',
    position: 'relative',
    marginBottom:20
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b5b5b5',
    padding: 10,
    paddingLeft: 40, // Adjust left padding to accommodate the search icon
    paddingRight: 40, // Add right padding to accommodate the search icon
    fontSize: 15,
  },
  searchIcon: {
    position: 'absolute',
    top: '50%',
    right: 10, // Move the icon to the right
    transform: [{ translateY: -15 }], // Adjust translateY based on the icon size
  },
  containerTop:{
    flexDirection:"row-reverse"
  },
  button: {
    backgroundColor: "#eee",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    
    alignItems: "center",
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
    margin: 5,
    textAlign: "center",
  },
  
});

export default ConversationListScreen;
