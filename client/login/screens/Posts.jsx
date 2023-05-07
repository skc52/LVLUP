import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, FlatList, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { showAllPosts, updateAPost } from '../redux/postActions';
import Loader from '../components/Loader';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { getChallengeById } from '../redux/challengeActions';
import { getAUser } from '../redux/actions'
import { upvotePost } from '../redux/postActions';
import { addNewComment } from '../redux/commentActions';

const Post = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const {user} = useSelector((state)=>state.auth)
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {comments} = useSelector((state)=>state.comment)
    const[postComments, setPostComments] = (comments);
  const handleLike = () => {
    setLiked(!liked);
  };

  const handleComment = () => {
    console.log('Comment:', comment);
    dispatch(addNewComment(post._id.toString(), comment));
    setComment('');
  };


  /*
  postId,
        creatorId:user._id,
        creatorName:user.name,
        creatorAvatar:user.avatar.url,
        comment,
        commentedAt: new Date(),
        edited: false, */
  
  const renderComment = ({ item }) => {
    return (
      <View style={styles.comment}>
        <Image style={styles.image} source={{ uri: item?.creatorAvatar }} />

        
          <Text style={styles.commentUsername}>{item?.creatorName}</Text>
        <Text style={styles.commentText}>{item?.comment}</Text>
      </View>
    );
  };

  
  const showProfileHandler = (user) => {
    dispatch(getAUser(user.id));
    navigation.navigate("profile", {profileUser:user, me:false} )
}

const [isUpvoted, setIsUpvoted] = useState(false);
 const upvoteChallengeHandler = () => {
    setIsUpvoted(!isUpvoted);
    dispatch(upvotePost(post._id.toString()));

  };

const checkIfUpvoted = (challenge) => {
    setIsUpvoted(false);



    post?.likes?.map((userId, index)=>{
        if(userId?.toString() === user?._id.toString()){
            setIsUpvoted(true);
            

            return;
        }

    })
    }



    useEffect(()=>{
      if (!user){
        navigation.navigate("login")
      }
       
    }, [])



 useEffect(()=>{
    // console.log(comments)
    checkIfUpvoted(post)
    // filterCommentsForPost();
  }, [post])




  return (
    <View style={styles.post}>
        <View style ={styles.userInfo}>
                <Image style={styles.image} source={{ uri: post.creatorId.avatar.url }} />
                <TouchableOpacity
                        

                 onPress={()=>{showProfileHandler(post.creatorId)}}>
                    <Text style={styles.name}>{post.creatorId.name}</Text>
                    </TouchableOpacity>
              </View>

      <Text style={styles.text}>{post.title}</Text>
      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.interactions}>
      <TouchableOpacity onPress={upvoteChallengeHandler}>
                  <Text style={[styles.interaction, isUpvoted ? styles.upvotedButton : styles.upvoteButton]}>{post.likes.length} likes</Text>
        </TouchableOpacity>
        {post.challenge &&
        <TouchableOpacity
         onPress={()=>{ dispatch(getChallengeById(post.challenge.toString())) ;navigation.navigate('challenge')}}>
          <Text style={styles.interaction}>View Challenge</Text>
        </TouchableOpacity>}

        {post.allowUpdate && post.creatorId._id.toString() === user._id.toString() &&
        <TouchableOpacity
         onPress={()=>{ 
          navigation.navigate("postCreate", {post:post})}
         }>
          <Text style={styles.interaction}>Edit</Text>
        </TouchableOpacity>}



          {post.comments.length !== 0 &&
        <TouchableOpacity onPress={() => setShowComments(true)}>
          
          <Text style={styles.interaction}>{post.comments?.length} comments</Text>
        </TouchableOpacity>}

        {post.comments.length === 0 &&
          
          <Text style={styles.noComment}>No comments</Text>}

        
      </View>
      <TextInput
        style={styles.commentInput}
        value={comment}
        placeholder="Add a comment..."
        onChangeText={setComment}
        onSubmitEditing={handleComment}
      />
            <View style = {styles.divider}></View>

      <Modal visible={showComments} animationType="slide">
        <View style={styles.commentsModal}>
          {post?.comments &&
          <FlatList data={post.comments} renderItem={renderComment} keyExtractor={item => item._id.toString()} />
          }
         <TouchableOpacity onPress={() => setShowComments(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View></View>
      <View style = {styles.divider}>

      </View>

      
    </View>
  );
};

const App = ({navigation, route}) => {
    const { posts } = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const renderItem = ({ item }) => {
      return <Post post={item} />;
    };

    const {all} = route.params;
    useFocusEffect(
        React.useCallback(() => {
          // Your code here that you want to run when the component comes into focus
          console.log("EHHEHE")

          if (all){
            console.log("EHHEHE")
            dispatch(showAllPosts());

          }

      
          return () => {
            // Optional cleanup code that you want to run when the component loses focus
          };
        }, []) // Empty dependency array ensures that the effect runs only once when the component is mounted
      );
  
    useEffect(() => {
      if (all){
        dispatch(showAllPosts());

      }

    }, []);
  
    return (
      <View style={styles.container}>
        {posts? (
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item?._id.toString()}
          />
        ) : (
          <Loader/>
        )}
      </View>
    );
};

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: 'gray',
        marginVertical: 10,
      },
container: {
flex: 1,
marginTop: 50,
paddingHorizontal: 10,
}, 
post: {
marginBottom: 20,
},
userInfo:{
    width:"100%",
    flexDirection:"row",
    justifyContent:"space-between"
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
    marginBottom: 10,},

image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    overflow: "hidden",
},
noComment:{
  fontSize: 16,
  fontWeight: "bold",
  textAlign:"center",
  verticalAlign:"middle"
  // margin:"",
},
name:{
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
},
text: {
fontSize: 18,
marginTop: 10,
},
content:{
    marginTop: 10,
},
interactions: {
flexDirection: 'row',
justifyContent: 'space-between',
marginTop: 10,
},
interaction: {
fontSize: 16,
},
liked: {
fontWeight: 'bold',
},
commentInput: {
marginTop: 10,
padding: 10,
backgroundColor: '#f0f0f0',
borderRadius: 10,
},
commentsModal: {
flex: 1,
marginTop: 50,
paddingHorizontal: 10,
},
comment: {
flexDirection: 'row',
marginBottom: 10,
},
commentUsername: {
  marginVertical: 10,

fontWeight: 'bold',
marginRight: 5,
},
commentText: {
  marginVertical: 10,

flex: 1,
},
closeButton: {
fontSize: 16,
fontWeight: 'bold',
textAlign: 'center',
marginTop: 20,
},
});

export default App;