import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet , KeyboardAvoidingView,ScrollView, TouchableOpacity} from 'react-native';
import { createChallenge } from '../redux/challengeActions';
import { Chip } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../redux/postActions';
const CreateChallengeScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [challenge, setChallenge] = useState('');
  const [duration, setDuration] = useState('');
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState('');

  const {challenge:newChalleng} = useSelector(state=>state.createChallenge)

  const dispatch = useDispatch();
  const addTagHandler= () => {
    setTags([...tags, tag]);
    setTag("");

  }
  const clearTagsHandler = () => {
    setTags([]);
  };

  const emptyInput = () => {
    setTitle("");
    setChallenge("");
    setDuration("");
    setTags([]);
    setTag("");
  }

  const handleSubmit = () => {
    // handle submitting the challenge data to the server
    const challengeData = { title, challenge, duration, tags };
    console.log(challengeData)
    dispatch(createChallenge(title, challenge, duration, tags));
    emptyInput();
  };

 

  return (
    <KeyboardAvoidingView 
    style={styles.container} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={100} // add extra offset if needed
  >
      <View  style = {styles.keyword}>  

        <Text>Title:</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          style = {styles.input}
        />
      </View>

      <View  style = {styles.keyword}>  

      <Text>Challenge:</Text>
      <TextInput
        value={challenge}
        onChangeText={setChallenge}
        placeholder="Enter challenge"
        style = {styles.input}

      />
            </View>


            <View  style = {styles.keyword}>  

      <Text>Duration:</Text>
      <TextInput
        value={duration}
        onChangeText={setDuration}
        keyboardType='numeric'
        placeholder="Enter duration"
        style = {styles.input}

      />
                  </View>



<View style = {styles.tags}>
        <Text>Tags:</Text>
        <TextInput
          value={tag}
          onChangeText={setTag}
          placeholder="Add a tag"
          style = {styles.input}

        />

        <Button title="Add tag" onPress={addTagHandler} />
      {/* TODO CLEAR TAGS */}
      {/* ICON */}
        <Button title="Clear tags" color={"#aaf"} onPress={clearTagsHandler} />
        
    </View>

    <View style  = {styles.tagList}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>  
        {tags.map((tag, index) => (
            <Chip key={tag + index.toString()} onClose={() => setTags(tags.filter((t) => t !== tag))}>
              <Text>{tag}</Text>
            </Chip>
      ))}
</ScrollView>
</View>



  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
    <Text style={[styles.buttonText, { color: "green" }]}>Create Challenge</Text>
  </TouchableOpacity>


  <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate("postCreate",{post:null})}}>
    <Text style={[styles.buttonText, { color: "grey" }]}>Create a Post?</Text>
  </TouchableOpacity>

      {/* <Button style = {styles.button} title="Create Challenge" onPress={handleSubmit} /> */}
    </KeyboardAvoidingView>
  );
};




const styles = StyleSheet.create({
  
  container: {
    marginVertical: 50,    

  },
  keyword:{
    flexDirection:"row",
    alignItems: 'center',
    marginBottom: 20,
  },
  searchContainer: {

    width: '90%',
    position: 'relative',
    marginBottom:20
  },
  // input: {
  //   backgroundColor: '#fff',
  //   borderWidth: 1,
  //   borderColor: '#b5b5b5',
  //   padding: 10,
  //   paddingLeft: 40, // Adjust left padding to accommodate the search icon
  //   fontSize: 15,
  // },
  searchIcon: {
    position: 'absolute',
    top: '50%',
    left: 10, // Adjust the left position of the search icon as needed
    transform: [{ translateY: -15 }], // Adjust translateY based on the icon size
  },

  
  button: {
    backgroundColor: "#eee",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
    margin: 5,
    textAlign: "center",
  },
  tags: {
    flexDirection:"row",
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 5,
    height: 50, // set a fixed height for the ScrollView
  },

});
export default CreateChallengeScreen;
