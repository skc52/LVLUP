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
 /*=============================================================
addNewComment()
NAME
    addNewComment - Creates a new comment on a post.
SYNOPSIS
    addNewComment = async (postId, comment) => {...};
    postId -> The ID of the post to add the comment to.
    comment -> The content of the comment.
DESCRIPTION
    This function creates a new comment on a post by sending a POST request to the server's '/add/comment/{postId}' endpoint.
    It dispatches Redux actions to update the application state based on the comment creation outcome.
PARAMETERS
    postId - The ID of the post to add the comment to.
    comment - The content of the comment.
RETURNS
    None.
=============================================================*/
export const addNewComment = (postId, comment) => async (dispatch) => {
  try {
      dispatch({ type: COMMENT_CREATE_REQUEST });
      console.log("HERE IN comment creation");

      const { data } = await axios.post(`${serverUrl}/add/comment/${postId}`, { comment }, config);
      dispatch({ type: COMMENT_CREATE_SUCCESS, payload: data });
  } catch (error) {
      dispatch({ type: COMMENT_CREATE_FAIL, payload: error.response.data });
  }
};

  
   