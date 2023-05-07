import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet , Button, ScrollView} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { listChallenges, listChallengesCreatedByMe, listFollowedChallenges, getChallengeById, getAllCheckedInMessages } from '../redux/challengeActions';
import { Chip } from 'react-native-paper';
import Loader from '../components/Loader';
import { CheckBox } from 'react-native-elements';

const ChallengeListScreen = ({ navigation }) => {
  const [createdByMe, setCreatedByMe] = useState(false);
  const [followedByMe, setFollowedByMe] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const challengeList = useSelector((state) => state.challengeList);
  const { loading, error, challenges } = challengeList;
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState('');
  
  const addTagHandler= () => {
    setTags([...tags, tag]);
    setTag("");
  }
  useFocusEffect(
    React.useCallback(() => {
      // Your code here that you want to run when the component comes into focus
      if (createdByMe){
        dispatch(listChallengesCreatedByMe(searchQuery, tags));
  
      }
      else if (followedByMe){
        dispatch(listFollowedChallenges(searchQuery, tags));

      }
      else{
        dispatch(listChallenges(searchQuery, tags));
  
      }
  
      return () => {
        // Optional cleanup code that you want to run when the component loses focus
      };
    }, []) // Empty dependency array ensures that the effect runs only once when the component is mounted
  );
  useEffect(() => {
    if (createdByMe){
      dispatch(listChallengesCreatedByMe(searchQuery, tags));

    }
    else if (followedByMe){
      dispatch(listFollowedChallenges(searchQuery, tags));

    }
    else{
      dispatch(listChallenges(searchQuery, tags));

    }
  }, [dispatch, createdByMe, followedByMe]);

  const handleJoinChallenge = (challengeId) => {
    // TODO: implement join challenge logic


  };

  const searchHandler = () => {
    if (createdByMe){
      dispatch(listChallengesCreatedByMe(searchQuery, tags));

    }
    else if (followedByMe){
      dispatch(listFollowedChallenges(searchQuery, tags));

    }
    else{
      dispatch(listChallenges(searchQuery, tags));

    }
  }

  const renderChallengeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.challengeItem}
      onPress={() =>  {dispatch(getChallengeById(item._id))  ;
        dispatch(getAllCheckedInMessages(item._id));
  
        navigation.navigate('challenge')}}>
      <Text style={styles.challengeTitle}>{item.title}</Text>
      <Text style={styles.challengeDescription}>{item.challenge}</Text>
    </TouchableOpacity>
  );

  const clearTagsHandler = () => {
    setTags([]);
  };


  const handleCreatedByMeChange = () => {
    setCreatedByMe(!createdByMe);
    setFollowedByMe(false);
  };
  const handleFollowedByMe = () => {
    setFollowedByMe(!followedByMe);
    setCreatedByMe(false);
  };
  return (
    <View style={styles.container}>
      <CheckBox
        title="Show challenges created by me"
        checked={createdByMe}
        onPress={handleCreatedByMeChange}
      />
      <CheckBox
        title="Show challenges followed by me"
        checked={followedByMe}
        onPress={handleFollowedByMe}
      />
     
        <View  style = {styles.keyword}>  
        <Text>Keyword:</Text>

        <TextInput
          style = {styles.input}
          placeholder="Search Challenges"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
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
<Button title = "Search" onPress = {searchHandler}/>

</View>
    {createdByMe && (
        <Text>List of challenges created by the user</Text>
      )}
      {followedByMe && (
        <Text>List of challenges followed by the user</Text>
      )}
      {!createdByMe && !followedByMe && (
        <Text>List of all challenges</Text>
      )}

      {loading ? (
        <Loader/>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={challenges}
          keyExtractor={(item) => item._id}
          renderItem={renderChallengeItem}
          style = {{marginTop:10}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:50
  },
  keyword:{
    flexDirection:"row",
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  challengeItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  joinButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  challengeDescription: {
    marginTop: 5,
  },
});

export default ChallengeListScreen;
