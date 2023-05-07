import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import {Button} from "react-native-paper"
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllChallengesIHaveInteractedWith } from '../redux/challengeActions'
import { sendFollowRequest , unFollow, clearAcceptSuccess, clearSendSuccess, clearUnfollowSuccess } from '../redux/actions'
import {COLORS, FONT, SIZES, SHADOWS} from './Colors'
import { showAllPostsOfAUser } from '../redux/postActions'
import Settings from './Settings'
const Profile = ({ navigation, route }) => {
    const { user } = useSelector((state) => state.auth);
    const { user2, sendReqSuccess, unfollowSuccess, acceptReqSuccess } = useSelector(
      (state) => state.follow
    )
    const {challenges:allchallenges, loading, error} = useSelector((state)=>state.fetchChallenges)

    const {success} = useSelector(state=>state.challengeList)
    const { profileUser, me } = route.params;
    const dispatch = useDispatch();
    const [btnText, setBtnText] = useState("Follow");

    const viewChallengesHandler = () => {
      dispatch(fetchAllChallengesIHaveInteractedWith(profileUser._id));

      navigation.navigate("challegesMine", {userId:profileUser._id});


    }
    const viewUserHistory = () => {
      dispatch(showAllPostsOfAUser(profileUser._id));

      navigation.navigate("posts", {all:false});
    }
    
  
    const followHandler = () => {
      console.log("TRYING TO FOLLOw")
      if (profileUser.followers.includes(user._id)) {
        dispatch(unFollow(user._id));
      } else if (profileUser.followRequests.includes(user._id)) {
      } else {
        dispatch(sendFollowRequest(profileUser._id));
      }
    };
  
    useEffect(() => {

      if (user._id === profileUser._id) {
        console.log("same users");
      } else {
        if (profileUser.followers.includes(user._id)) {
          setBtnText("Unfollow");
          console.log("Unfollow");
        } else if (profileUser.followRequests.includes(user._id)) {
          setBtnText("Request Sent");
          console.log(profileUser);
          console.log("Request sent");
        } else {
          console.log(profileUser);
          setBtnText("Follow");
          console.log("Follow");
        }
      }
  
      if (user && !user.isActivated) {
        navigation.navigate("sendActivate");
      }
      
    }, []);

    
  
    useEffect(() => {
      if (sendReqSuccess) {
        setBtnText("Request Sent");
        dispatch(clearSendSuccess());
      }
    }, [sendReqSuccess]);
  
    useEffect(() => {
      if (unfollowSuccess) {
        setBtnText("Follow");
        dispatch(clearUnfollowSuccess());
      }
    }, [unfollowSuccess]);
  
    return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatar}>
        <Image
          source={{ uri: profileUser?.avatar?.url }}
          resizeMode="contain"
          style={styles.avatarImage}
        />
      </TouchableOpacity>
      <Text style={styles.name}>{profileUser?.name}</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>{profileUser?.level} LEVEL</Text>
        <Text style={styles.stat}>{profileUser?.followers.length} Followers</Text>
        <Text style={styles.stat}>{profileUser?.following.length} Following</Text>
      </View>
      {user._id === profileUser._id ? (
        <TouchableOpacity style={styles.updateProfileButton} onPress={() => navigation.navigate("updateProfile")}>
          <Text style={styles.updateProfileButtonText}>Update Profile</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.followButton, { backgroundColor: user.following.includes(profileUser._id) ? "#f00" : "#0f0" }]} onPress={followHandler}>
          <Text style={styles.followButtonText}>{btnText}</Text>
        </TouchableOpacity>
      )}


      <TouchableOpacity style={styles.viewChallengesButton} onPress={viewChallengesHandler}>
        <Text style={styles.viewChallengesButtonText}>View User Challenges</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewChallengesButton} onPress={viewUserHistory}>
        <Text style={styles.viewChallengesButtonText}>View User History</Text>
      </TouchableOpacity>

      {user._id === profileUser._id && <Settings navigation={navigation}/>}

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop:20,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    marginVertical: 20,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  stat: {
    fontSize: 15,
    fontWeight: "600",
  },
  updateProfileButton: {
    backgroundColor: "#eee",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  updateProfileButtonText: {
    color: "green",
    fontSize: 16,
    margin: 5,
    textAlign: "center",
  },
  followButton: {
    backgroundColor: "#eee",
      borderRadius: 5,
      padding: 10,
      marginVertical: 5,
      width: "100%",
      alignItems: "center",
  },
  followButtonText: {
    color: "#333",
      fontSize: 16,
      margin: 5,
      textAlign: "center",
  },
  viewChallengesButton: {
    backgroundColor: "#eee",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  viewChallengesButtonText: {
    color: "blue",
      fontSize: 16,
      margin: 5,
      textAlign: "center",
  },
});

export default Profile;