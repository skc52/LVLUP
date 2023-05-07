import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from "react-native-paper"
import Icon from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux'

import { getAllUsersSearch } from '../redux/actions'

const SearchUser = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");

  const searchHandler = () => {
    dispatch(getAllUsersSearch(username));
    navigation.navigate("searchResults");
  }

  useEffect(() => {
    if (user && !user.isActivated) {
      navigation.navigate("sendActivate");
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SEARCH</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Search users...'
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity
          disabled={!username}
          onPress={searchHandler}
          style={styles.searchIcon}
        >
          <Icon name="search1" size={30} color="#980" />
        </TouchableOpacity>
      </View>
      
    </View>
  )
}

export default SearchUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    margin: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "70%",
    borderWidth: 1,
    borderColor: "#b5b5b5",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
  },
  searchIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#900",
    padding: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
