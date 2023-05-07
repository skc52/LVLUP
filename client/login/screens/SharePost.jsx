import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet , ScrollView, TouchableOpacity} from 'react-native';
import { createChallenge } from '../redux/challengeActions';
import { Chip } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';
import { createPost, updateAPost } from '../redux/postActions';
const SharePost = ({navigation, route}) => {
    const {post} = route.params;

    const {isCreated, error} = useSelector((state)=>state.posts)
  const [title, setTitle] = useState('');
  const [challenge, setChallenge] = useState('');

  const dispatch = useDispatch();
  
    useEffect(()=>{
        if (post){
            setTitle(post?.title);
        setChallenge(post?.content)
        }
        
    }, [])

   
  const emptyInput = () => {
    setTitle("");
    setChallenge("");
   
  }

  const handleSubmit = () => {
    // handle submitting the challenge data to the server
    const challengeData = { title, challenge };
    console.log(post, "DIUWBIUBIUWBIBSI");
    if (!post){
        dispatch(createPost(title, challenge));

    }
    else{
        console.log("UPDATING A POST")
        dispatch(updateAPost(title, challenge, post._id.toString()))

    }
    emptyInput();
  };

 

  return (
    <View style = {styles.container}>
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

      <Text>Post:</Text>
      <TextInput
        value={challenge}
        onChangeText={setChallenge}
        placeholder="Enter your post"
        style = {styles.postInput}
        multiline={true}
  numberOfLines={6}

      />
            </View>


        





    




  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
    <Text style={[styles.buttonText, { color: "green" }]}>{post?"Edit":"Create"}</Text>
  </TouchableOpacity>

  {isCreated && <Text style={styles.successText}>Successful</Text>}
    {error && <Text>Error occured. Try again!</Text>}

    <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate("challengeCreate")}}>
<Text style={[styles.buttonText, { color: "gray" }]}>Create a Challenge?</Text>
</TouchableOpacity>
    </View>


  );
};




const styles = StyleSheet.create({
    successText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'center',
        marginTop: 20,
      },
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
  postInput:{
    flex: 1,
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
export default SharePost;
