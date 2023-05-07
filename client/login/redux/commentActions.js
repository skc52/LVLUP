import {
    COMMENT_CREATE_REQUEST,
    COMMENT_CREATE_SUCCESS,
    COMMENT_CREATE_FAIL,
    COMMENT_ALL_REQUEST,
    COMMENT_ALL_SUCCESS,
    COMMENT_ALL_FAIL
  
  } from './commentConstants.js';
  import axios from "axios";

  const serverUrl = `http://192.168.63.115:4000/api/v1`;
  const config = {headers:{"Content-type":"application/json"},  withCredentials: true};
  export const addNewComment = (postId, comment) => async (dispatch) => {
    try {
      dispatch({ type: COMMENT_CREATE_REQUEST });
      console.log("HERE IN comment creation")

      const {data} = await axios.post(`${serverUrl}/add/comment/${postId}`,{comment},config);
      dispatch({ type: COMMENT_CREATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: COMMENT_CREATE_FAIL, payload: error.response.data });
    }
  };

  
   