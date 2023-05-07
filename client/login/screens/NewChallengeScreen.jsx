import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { getChallengeById , upvoteChallenge, quitChallenge,getMyStreaksForAChallenge,
   joinChallenge, getAllCheckedInMessages, completeChallenge} from '../redux/challengeActions';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../components/Loader';

const ChallengeScreen = ({navigation, route}) => {
  const {challenge} = route.params;
    const {streak, error:strkError, loading:strkLoading} = useSelector((state)=>state.streak)
    const {messages} =  useSelector((state)=>state.checkedInMessages);
    const {user} = useSelector((state)=>state.auth)
  const [isJoined, setIsJoined] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [quited, setQuited] = useState(false);
  const [completed, setCompleted] = useState(false);

    const dispatch = useDispatch();
  const joinChallengeHandler = () => {
    setIsJoined(true);
    dispatch(joinChallenge(challenge._id.toString()));

  };

  const upvoteChallengeHandler = () => {
    setIsUpvoted(!isUpvoted);
    dispatch(upvoteChallenge(challenge._id.toString()));

  };
  const renderMessages = ({ item }) => (
    <TouchableOpacity>
      <View style={styles.singleMessage}>
        <Text style={styles.messageName}>{item.name}</Text>

          <Text style={styles.latestReport}>{item.latestReport}</Text>
        
      </View>
    </TouchableOpacity>
  );


  const quitChallengeHandler= ()=>{
    console.log("FROM CLICKING ON QUIT TO")
    setQuited(true);
    dispatch(quitChallenge(challenge._id.toString()));
    // dispatch(getChallengeById(challenge._id.toString()))

  }



  


  
  useFocusEffect(
    React.useCallback(() => {
      console.log("FOCUS")
      checkIfUpvoted(challenge)
      // dispatch(getAllCheckedInMessages(challenge?._id.toString()))
      if (streak === challenge?.duration){
        console.log("COMPLETEING THE CHLALENGE")
      }
      checkIfJoined(challenge, user._id)
      checkIfQuitted(challenge)
      checkIfCompleted(challenge)


      return () => {
      };
    }, []) // Empty dependency array ensures that the effect runs only once when the component is mounted
  );
  useEffect(()=>{
    console.log("CHALLENGE is", challenge.title)

    dispatch(getMyStreaksForAChallenge(challenge?._id.toString()))

    // COMPLETE THE CHALLENGE if streak === duration
    if (streak === challenge?.duration){
      console.log("COMPLETEING THE CHLALENGE");
      dispatch(completeChallenge(challenge?._id.toString()))

    }
    checkIfUpvoted(challenge)
    checkIfJoined(challenge, user._id)
    checkIfQuitted(challenge)
    checkIfCompleted(challenge)
    
  }, [challenge, quited])


  const checkIfJoined = (challenge, id) => {
    setIsJoined(false);

        challenge?.joinedUsers?.map((user, index)=>{
            if(user?.userId.toString() === id.toString() && user?.quit === false){
                setIsJoined(true);
                return;
            }

        })
  }

  const checkIfUpvoted = (challenge) => {
    setIsUpvoted(false);



    challenge?.upvotes?.map((userId, index)=>{
        if(userId?.toString() === user?._id.toString()){
            setIsUpvoted(true);
            console.log("HEREX")

            return;
        }

    })
    }

    const checkIfQuitted = (challenge) => {
        setQuited(false);
        console.log("HEREUSUUS BAOVE", challenge?._id)


        challenge?.joinedUsers?.map((usr, index)=>{
          if (usr.userId.toString() === user._id.toString()){
            if(usr?.quit === true){
              setQuited(true);
              return;
          }

          }
            
        })
        
    }

    const checkIfCompleted = (challenge) => {
      setCompleted(false);
      console.log("HEREUSUUS BAOVE", challenge?._id)


      challenge?.joinedUsers?.map((usr, index)=>{
        console.log(user);
        if (usr.userId.toString() === user._id.toString()){

          if(usr?.completed === true){
              setCompleted(true);
              return;
          }
        }

      })
      
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{challenge?.title} 
       {!strkLoading &&
      <Text style={styles.streak}>🔥{streak}</Text>}
       </Text>
      <Text style={styles.description}>{challenge?.challenge}</Text>

      {quited&& 
        <Text style = {styles.quit}>You are a quitter. I will not let you rejoin this challenge</Text>
      }
      {isJoined && !completed && !quited &&
          <Text style={styles.joinedText}>You have joined this challenge</Text>}
      {completed && <Text style={styles.joinedText}>You have completed this challenge</Text>}
              

        <View style = {styles.btnContainer}>
        
              {isJoined && !completed &&  !quited &&
   
          <TouchableOpacity onPress={quitChallengeHandler}>
            <Text style={styles.quitButton}>Quit Challenge</Text>
          </TouchableOpacity>
          }

          {isJoined && !completed && !quited &&<TouchableOpacity onPress={()=>{navigation.navigate("checkin", {challengeId:challenge?._id})}}>
              <Text style={styles.checkInButton}>Check In</Text>
        </TouchableOpacity>}

          {!isJoined &&!completed && !quited &&
          <TouchableOpacity onPress={joinChallengeHandler}>
            <Text style={styles.joinButton}>Join Challenge</Text>
          </TouchableOpacity>}

          <TouchableOpacity onPress={upvoteChallengeHandler}>
            <Text style={isUpvoted ? styles.upvotedButton : styles.upvoteButton}>
                {challenge?.upvotes?.length} Upvotes
            </Text>
          </TouchableOpacity>

        </View>

      
      
    
      


      <Text>Displaying All Checked in Messages</Text>
      <View>


      <View style = {styles.messages}>
      <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderMessages}
          style = {{marginTop:10}}
        />
      </View>
    </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  quit: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
  },
  joinedText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkInButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  quitButton: {
    backgroundColor: 'red',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: 'green',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  upvoteButton: {
    backgroundColor: 'gray',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  upvotedButton: {
    backgroundColor: 'green',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  messages: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    height: 350,
  },
  singleMessage: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingVertical: 5,
  },
  messageName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  latestReport: {
    fontSize: 14,
  },
  btnContainer:{
    flexDirection:"row",
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    flexWrap:"wrap"
    
  }
});

export default ChallengeScreen;
