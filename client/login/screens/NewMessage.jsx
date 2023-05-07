import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import Loader from "../components/Loader.jsx"
import {COLORS, FONT, SIZES, SHADOWS} from './Colors'
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux';
const peopleData = [
  { id: '1', name: 'John Doe', age: '25', occupation: 'Software Engineer' },
  { id: '2', name: 'Jane Smith', age: '30', occupation: 'Graphic Designer' },
  { id: '3', name: 'Bob Johnson', age: '35', occupation: 'Sales Manager' },
  { id: '4', name: 'Alice Lee', age: '40', occupation: 'Project Manager' },
  { id: '5', name: 'Tom Baker', age: '45', occupation: 'Marketing Director' },
];



const NewMessage = ({navigation}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();
//   const [peopleData, setPeopleData] = ([]);

    const {users} = useSelector((state)=>state.users)

  useEffect(() => {
    // setPeopleData(users);
   
    const results = users?.filter(person =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);


  const showConvoHandler = (id) => {
    // dispatch(getAUser(user.id));
    console.log(id, "from");
    navigation.navigate("conversation", {recipient:id} )
  }

  const renderItem = ({ item }) => (
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

      
      onPress={()=>{ showConvoHandler(item._id)}}
    >   
       <View style={styles.conversationItem}>
      <Text style={styles.name}>{item.name}</Text>
    </View>
    </TouchableOpacity>

   
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onChangeText={setSearchTerm}
          value={searchTerm}
        />
      </View>
      {users?.length === 0 && <Text style = {styles.description} >No new users</Text>}
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:50
  },
  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchInput: {
    backgroundColor: '#eee',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 10,
  },
  itemContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    // fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
  },
  occupation: {
    fontSize: 16,
    color: '#666',
  },

});

export default NewMessage;
