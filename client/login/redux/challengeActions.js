import axios from 'axios';
import {
    CREATE_CHALLENGE_REQUEST,
    CREATE_CHALLENGE_SUCCESS,
    CREATE_CHALLENGE_ERROR,
    CHALLENGE_LIST_REQUEST, CHALLENGE_LIST_SUCCESS, CHALLENGE_LIST_FAIL,
    GET_CHALLENGE_REQUEST, GET_CHALLENGE_FAILURE, GET_CHALLENGE_SUCCESS,
    UPVOTE_CHALLENGE_REQUEST,
  UPVOTE_CHALLENGE_SUCCESS,
  UPVOTE_CHALLENGE_FAIL,
  QUIT_CHALLENGE_REQUEST,
  QUIT_CHALLENGE_SUCCESS,
  QUIT_CHALLENGE_FAIL,
  JOIN_CHALLENGE_FAIL,
  JOIN_CHALLENGE_SUCCESS,
  JOIN_CHALLENGE_REQUEST,
  CHECKIN_CHALLENGE_REQUEST,
  CHECKIN_CHALLENGE_FAIL,
  CHECKIN_CHALLENGE_SUCCESS,
  GET_CHECKED_IN_MESSAGES_FAIL,
  GET_CHECKED_IN_MESSAGES_REQUEST,
  GET_CHECKED_IN_MESSAGES_SUCCESS,
  CHECK_STREAK_FAIL,
  CHECK_STREAK_REQUEST, 
  CHECK_STREAK_SUCCESS,
  CLEAR_MSG,
  COMPLETE_CHALLENGE_FAILURE,
  COMPLETE_CHALLENGE_REQUEST,
  COMPLETE_CHALLENGE_SUCCESS,
  FETCH_CHALLENGES_REQUEST,
  FETCH_CHALLENGES_SUCCESS,
  FETCH_CHALLENGES_FAIL,
  } from './challengeConstants.js';
  const serverUrl = `http://192.168.63.115:4000/api/v1`;
  const config = {headers:{"Content-type":"application/json"},  withCredentials: true};



export const createChallenge = (title, challenge, duration, tags) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_CHALLENGE_REQUEST });
    console.log("HERE IN CHallenge action")
    const {data} = await axios.post(`${serverUrl}/challenge/add`, {title, challenge, duration, tags}, config);
    dispatch({ type: CREATE_CHALLENGE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_CHALLENGE_ERROR, payload: error.response.data });
  }
};




export const listChallenges = (keyword = "" , tags) => async (dispatch) => {
  try {
    console.log("Here in list challenges actions")
    dispatch({ type: CHALLENGE_LIST_REQUEST });
    let tagsCopy = []
    if (tags.length === 0){
        tagsCopy = [""];
    }
    else{
      tagsCopy = tags;
    }

    const { data } = await axios.post(`${serverUrl}/challenge/all`, {
      keyword, tags:tagsCopy
    },

    config
    
    );
  console.log("HERE AFTEER")

    dispatch({
      type: CHALLENGE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHALLENGE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};



export const listFollowedChallenges = (keyword = "" , tags) => async (dispatch) => {
  try {
    console.log("Here in list challenges actions")
    dispatch({ type: CHALLENGE_LIST_REQUEST });
    let tagsCopy = []
    if (tags.length === 0){
        tagsCopy = [""];
    }
    else{
      tagsCopy = tags;
    }

    const { data } = await axios.post(`${serverUrl}/challenge/feed`, {
      keyword, tags:tagsCopy
    },

    config
    
    );
  console.log("HERE AFTEER")

    dispatch({
      type: CHALLENGE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHALLENGE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};






export const listChallengesCreatedByMe = (keyword = "" , tags) => async (dispatch) => {
  try {
    console.log("Here in list challenges actions")
    dispatch({ type: CHALLENGE_LIST_REQUEST });
    let tagsCopy = []
    if (tags.length === 0){
        tagsCopy = [""];
    }
    else{
      tagsCopy = tags;
    }

    const { data } = await axios.post(`${serverUrl}/challenge/creator/me`, {
      keyword, tags:tagsCopy
    },

    config
    
    );
  console.log("HERE AFTEER")

    dispatch({
      type: CHALLENGE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHALLENGE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const getChallengeById = (id) => async (dispatch) => {
  dispatch({type:GET_CHALLENGE_REQUEST});

  try {
    console.log(id)

    const {data} = await axios.get(`${serverUrl}/challenge/${id}`, {
      withCredentials: true
    });
    console.log("DATA LOG", data.challenge.title)
    dispatch({type:GET_CHALLENGE_SUCCESS, payload:data});
  } catch (error) {
    dispatch({type:GET_CHALLENGE_FAILURE, payload: error.response && error.response.data.message
      ? error.response.data.message
      : error.message});
  }
};

// upvote a challenge
export const upvoteChallenge = (challengeId) => async (dispatch) => {
  try {
    console.log("Here in upvote")
    dispatch({ type: UPVOTE_CHALLENGE_REQUEST });
    const { data } = await axios.put(
      `${serverUrl}/challenge/upvote/${challengeId}`,
      {
        withCredentials:true
      }
      
    );
    dispatch({
      type: UPVOTE_CHALLENGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPVOTE_CHALLENGE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};



export const quitChallenge = (challengeId) => async (dispatch) => {
  try {
    console.log("ACTION IN QUIT TO")
    dispatch({ type: QUIT_CHALLENGE_REQUEST });
    const { data } = await axios.get(
      `${serverUrl}/challenge/quit/${challengeId}`,
      {
        withCredentials:true
      }
      
    );
    console.log("LOG QUIT", data.challenge)
    dispatch({
      type: QUIT_CHALLENGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: QUIT_CHALLENGE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const joinChallenge = (challengeId) => async (dispatch) => {
  try {
    console.log("ACTION IN JOIN TO")
    dispatch({ type: JOIN_CHALLENGE_REQUEST });
    const { data } = await axios.put(
      `${serverUrl}/challenge/join/${challengeId}`,
      {
        withCredentials:true
      }
      
    );
    dispatch({
      type: JOIN_CHALLENGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: JOIN_CHALLENGE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const dailyCheckInOnAChallenge = (challengeId, message) => async (dispatch) => {
  try {
    console.log("ACTION IN CHECK IN TO")
    dispatch({ type: CHECKIN_CHALLENGE_REQUEST });
    const { data } = await axios.put(
      `${serverUrl}/challenge/checkin/${challengeId}`,
      {message},
      config
      
      
    );
    dispatch({
      type: CHECKIN_CHALLENGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHECKIN_CHALLENGE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};



export const getAllCheckedInMessages = (challengeId) => async (dispatch) => {
  try {
    console.log("ACTION IN get all checked in messages IN TO")
    dispatch({ type: GET_CHECKED_IN_MESSAGES_REQUEST });
    const { data } = await axios.get(
      `${serverUrl}/challenge/checkedin/messages/${challengeId}`,
      {
        withCredentials:true,
      }
      
      
    );
    dispatch({
      type: GET_CHECKED_IN_MESSAGES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_CHECKED_IN_MESSAGES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getMyStreaksForAChallenge = (challengeId) => async (dispatch) => {
  try {
    console.log("ACTION IN get streaks IN TO")
    dispatch({ type: CHECK_STREAK_REQUEST });
    const { data } = await axios.get(
      `${serverUrl}/challenge/streak/${challengeId}`,
      {
        withCredentials:true,
      }
      
      
    );
    console.log(data);
    dispatch({
      type: CHECK_STREAK_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHECK_STREAK_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const completeChallenge = (challengeId) => async (dispatch) => {
  try {
    console.log("ACTION IN completing challenge IN TO")
    dispatch({ type: COMPLETE_CHALLENGE_REQUEST });
    const { data } = await axios.get(
      `${serverUrl}/challenge/complete/${challengeId}`,
      {
        withCredentials:true,
      }
      
      
    );
    console.log(data);
    dispatch({
      type: COMPLETE_CHALLENGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COMPLETE_CHALLENGE_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};



//   createdChallenges,
// joinedChallenges,
// quitChallenges,
// completedChallenges,
export const fetchAllChallengesIHaveInteractedWith = (userId) => async (dispatch) => {
  try {
    console.log("ACTION IN fetchings challenge IN TO")
    dispatch({ type: FETCH_CHALLENGES_REQUEST });
    const { data } = await axios.post(
      `${serverUrl}/challenge/all/profile`,
      {
        userId
      },
      config
      
      
    );

    dispatch({
      type: FETCH_CHALLENGES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_CHALLENGES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const clearMsg =  () => async (dispatch) => {
  dispatch({type:CLEAR_MSG})
}