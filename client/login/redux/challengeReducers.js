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
  FETCH_CHALLENGES_REQUEST,
  FETCH_CHALLENGES_SUCCESS,
  FETCH_CHALLENGES_FAIL,
  
  COMPLETE_CHALLENGE_FAILURE,
  COMPLETE_CHALLENGE_REQUEST,
  COMPLETE_CHALLENGE_SUCCESS,
  CLEAR_MSG

  } from './challengeConstants.js';

const initialState = {
    challenge: null,
    error: null,
    loading: false,
  };
  
  export const createChallengeReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_CHALLENGE_REQUEST:
        return { ...state, loading: true };
      case CREATE_CHALLENGE_SUCCESS:
        return { ...state, loading: false, challenge: action.payload };
      case CREATE_CHALLENGE_ERROR:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  

  export const challengeListReducer = (state = { challenges: [] }, action) => {
    switch (action.type) {
      case CHALLENGE_LIST_REQUEST:
        return { loading: true, challenges: [], success:false };
      case CHALLENGE_LIST_SUCCESS:
        return { loading: false, challenges: action.payload.challenges, success:true};
      case CHALLENGE_LIST_FAIL:
        return { loading: false, error: action.payload, success:false };
      default:
        return state;
    }
  };

  const initialState2 = {
    challenge: null,
    error: null,
    loading: false,
  };
export const challengeReducer = (state = initialState2, action) => {
  switch (action.type) {
    case GET_CHALLENGE_REQUEST:
      case UPVOTE_CHALLENGE_REQUEST:
        case QUIT_CHALLENGE_REQUEST:
          case JOIN_CHALLENGE_REQUEST:
            case CHECKIN_CHALLENGE_REQUEST:
              case COMPLETE_CHALLENGE_REQUEST:
      return {  loading: true, error: null };
    case GET_CHALLENGE_SUCCESS:
        case QUIT_CHALLENGE_SUCCESS:
          case JOIN_CHALLENGE_SUCCESS:
            case CHECKIN_CHALLENGE_SUCCESS:
              case UPVOTE_CHALLENGE_SUCCESS:

              case COMPLETE_CHALLENGE_SUCCESS:
      return {  challenge: action.payload.challenge, loading: false, message:action.payload.message?action.payload.message:"" };
      // case UPVOTE_CHALLENGE_SUCCESS:
      //   return {
      //     challenge: { ...state.challenge, upvotes:action.payload.challenge.upvotes },
      //     loading: false,
      //     message: action.payload.message ? action.payload.message : '',
      //   };
      case GET_CHALLENGE_FAILURE:
      case UPVOTE_CHALLENGE_FAIL:
        case QUIT_CHALLENGE_FAIL:
          case JOIN_CHALLENGE_FAIL:
            case CHECKIN_CHALLENGE_FAIL:
              case COMPLETE_CHALLENGE_FAILURE:
      return {  error: action.payload, loading: false };
    case CLEAR_MSG:
        return {...state, message:""}
    default:
      return state;
  }
};

// export const upvoteChallengeReducer = (state = { challenge: {} }, action) => {
//   switch (action.type) {
//     case UPVOTE_CHALLENGE_REQUEST:
//       return { loading: true };
//     case UPVOTE_CHALLENGE_SUCCESS:
//       return { loading: false, success: true, challenge: action.payload.challenge };
//     case UPVOTE_CHALLENGE_FAIL:
//       return { loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };




export const checkedInMessagesReducer = (state = { messages: [] }, action) => {
  switch (action.type) {
      case GET_CHECKED_IN_MESSAGES_REQUEST:
          return {
              ...state,
              loading: true,
          };
      case GET_CHECKED_IN_MESSAGES_SUCCESS:
          return {
              loading: false,
              messages: action.payload.checkedInMessages,
              error: null,
          };
      case GET_CHECKED_IN_MESSAGES_FAIL:
          return {
              loading: false,
              messages: [],
              error: action.payload,
          };
     
      default:
          return state;
  }
};


const initialState3 = {
  streak: 0,
  error: null,
  loading: false,
};

export const streakReducer = (state = initialState3 , action) => {
  switch (action.type) {
      case CHECK_STREAK_REQUEST:
          return {
              ...state,
              loading: true,
          };
      case CHECK_STREAK_SUCCESS:
          return {
              loading: false,
              streak: action.payload.streak,
              error: null,
          };
      case CHECKIN_CHALLENGE_FAIL:
          return {
              loading: false,
              streak: 0,
              error: action.payload,
          };
     
      default:
          return state;
  }
};


  
  
  
  
  
  
  
const initialState4 = {
  challenges:[],
  loading:false,
  error:null
};

export const challengesReducer = (state = initialState4, action) => {
  switch (action.type) {
    case FETCH_CHALLENGES_REQUEST:
      return {
        loading:true
      };
    case FETCH_CHALLENGES_SUCCESS:
      return {
        challenges: action.payload,
        loading:false
      };
    case FETCH_CHALLENGES_FAIL:
      return {
        error: action.payload,
        loading:false,
      };
    case "CLEAR_CHALLENGES_MY_INTERACTED":
      return {
        challenges:[],
        loading:false,
        error:null
      }
    default:
      return state;
  }
};