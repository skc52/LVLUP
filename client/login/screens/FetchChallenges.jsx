import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllChallengesIHaveInteractedWith, getChallengeById, getAllCheckedInMessages } from '../redux/challengeActions';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../components/Loader';
const ChallengesScreen = ({ navigation, route }) => {
  const [filter, setFilter] = useState(''); // default filter is created
  const [challenges, setChallenges] = useState([]);
    const {userId} = route.params;
    const dispatch = useDispatch();
    const {challenges:allchallenges, loading, error} = useSelector((state)=>state.fetchChallenges)


    
  useFocusEffect(
    React.useCallback(() => {
      console.log("FOCUS")
    //   dispatch(getAllCheckedInMessages(challenge?._id.toString()))
     
      dispatch(fetchAllChallengesIHaveInteractedWith(userId));
      console.log(allchallenges)

      return () => {
      };
    }, []) // Empty dependency array ensures that the effect runs only once when the component is mounted
  );

  // fetch challenges on component mount
  useEffect(() => {
    // RESET
    // dispatch({type:"CLEAR_CHALLENGES_MY_INTERACTED"})
    dispatch(fetchAllChallengesIHaveInteractedWith(userId));
    if (filter === "created"){
        setChallenges(allchallenges.createdChallenges)
    }
    else if (filter === "joined"){
        setChallenges(allchallenges.joinedChallenges)
    }
    if (filter === "quit"){
        setChallenges(allchallenges.quitChallenges)
    }
    if (filter === "completed"){
        setChallenges(allchallenges.completedChallenges)
    }

  }, [filter]);

  // function to render individual challenge items
  const renderChallenge = ({ item }) => (
    <TouchableOpacity
      style={styles.challengeItem}
      onPress={() =>  {dispatch(getChallengeById(item._id))  ;
        dispatch(getAllCheckedInMessages(item._id));
  
        navigation.navigate('challenge')}}>
      <Text style={styles.challengeTitle}>{item.title}</Text>
      <Text style={styles.challengeDescription}>{item.challenge}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterButtonsContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'created' && styles.activeFilterButton]}
          onPress={() => setFilter('created')}
        >
          <Text style={styles.filterButtonText}>Created</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'joined' && styles.activeFilterButton]}
          onPress={() => setFilter('joined')}
        >
          <Text style={styles.filterButtonText}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'quit' && styles.activeFilterButton]}
          onPress={() => setFilter('quit')}
        >
          <Text style={styles.filterButtonText}>Quit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.activeFilterButton]}
          onPress={() => setFilter('completed')}
        >
          <Text style={styles.filterButtonText}>Completed</Text>
        </TouchableOpacity>


        </View>

        {loading && <Loader/>}

        {!filter && <Text style = {styles.description}>Pick a category</Text>}

        {challenges.length === 0 && filter && <Text style = {styles.description}>No Challenges</Text>}
        <FlatList
            data={challenges}
            renderItem={renderChallenge}
            keyExtractor={(item) => item._id}
        />
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop:50
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#ccc',
    marginRight: 10,
    borderRadius: 5,
  },
  activeFilterButton: {
    backgroundColor: '#2196F3',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  challengeItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  challengeDescription: {
    marginTop: 5,
  },
  description:{
    color:"gray"
  }
});

export default ChallengesScreen;
