// postReducer.js
import {
    POST_CREATE_REQUEST,
    POST_CREATE_SUCCESS,
    POST_CREATE_FAIL,
    POST_UPDATE_REQUEST,
    POST_UPDATE_SUCCESS,
    POST_UPDATE_FAIL,
    POST_DELETE_REQUEST,
    POST_DELETE_SUCCESS,
    POST_DELETE_FAIL,
    POST_LIKE_REQUEST,
    POST_LIKE_SUCCESS,
    POST_LIKE_FAIL,
    POST_GET_ALL_REQUEST,
    POST_GET_ALL_SUCCESS,
    POST_GET_ALL_FAIL,
    POST_GET_ALL_LIKES_REQUEST,
    POST_GET_ALL_LIKES_SUCCESS,
    POST_GET_ALL_LIKES_FAIL,
    POST_GET_SINGLE_REQUEST,
    POST_GET_SINGLE_SUCCESS,
    POST_GET_SINGLE_FAIL,
    POST_GET_FOLLOWED_REQUEST,
    POST_GET_FOLLOWED_SUCCESS,
    POST_GET_FOLLOWED_FAIL,
    POST_GET_MY_POSTS_REQUEST,
    POST_GET_MY_POSTS_SUCCESS,
    POST_GET_MY_POSTS_FAIL,
  } from './postConstants';
  import axios from "axios";


  const serverUrl = `http://192.168.63.115:4000/api/v1`;
  const config = {headers:{"Content-type":"application/json"},  withCredentials: true};
  export const createPost = (title, content) => async (dispatch) => {
    try {
      dispatch({ type: POST_CREATE_REQUEST });
      console.log("HERE IN post creation")
      
      const {data} = await axios.post(`${serverUrl}/post/add`, {title, content, allowUpdate:true}, config);
      dispatch({ type: POST_CREATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: POST_CREATE_FAIL, payload: error.response.data });
    }
  };

  export const updateAPost = (title, content, postId) => async (dispatch) => {
    try {
      dispatch({ type: POST_UPDATE_REQUEST });
      console.log("HERE IN post updating")
      console.log(postId)
      const {data} = await axios.post(`${serverUrl}/post/update/${postId}`, {title, content}, config);
      dispatch({ type: POST_UPDATE_SUCCESS, payload: data });
    console.log(data, "YDATED");
    } catch (error) {
      dispatch({ type: POST_UPDATE_FAIL, payload: error.response.data });
    }
  };

  export const showAllPosts = () => async (dispatch) => {
    try {
      dispatch({ type: POST_GET_ALL_REQUEST });
      console.log("HERE IN show post")

      const {data} = await axios.get(`${serverUrl}/posts/all`, {withCredentials:true});
    //   console.log(data);
      dispatch({ type: POST_GET_ALL_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: POST_GET_ALL_FAIL, payload: error.response.data });
    }
  };

  // router.route("/posts/all/:userId").get(isAuthenticatedUser, getUserPosts);
  export const showAllPostsOfAUser = (userId) => async (dispatch) => {
    try {
      console.log("HERE in user posts")
      dispatch({ type: POST_GET_ALL_REQUEST });

      const {data} = await axios.get(`${serverUrl}/posts/all/${userId}`, {withCredentials:true});
    //   console.log(data);
      dispatch({ type: POST_GET_ALL_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: POST_GET_ALL_FAIL, payload: error.response.data });
    }
  };



  export const upvotePost = (postId) => async (dispatch) => {
    try {
      console.log("Here in upvote", postId)
      dispatch({ type: POST_LIKE_REQUEST });
    //   router.route("/post/toggleLike/:postId").put(isAuthenticatedUser, likeAPost);

      const { data } = await axios.put(
        `${serverUrl}/post/toggleLike/${postId}`,
        {
          withCredentials:true
        }
        
      );
      console.log(data);
      dispatch({
        type: POST_LIKE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: POST_LIKE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  