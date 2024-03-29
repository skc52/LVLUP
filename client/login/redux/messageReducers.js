import {
    FETCH_CONVERSATION_REQUEST,
    FETCH_CONVERSATION_SUCCESS,
    FETCH_CONVERSATION_FAILURE,
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAILURE,
    FETCH_CONVERSATION_LIST_REQUEST, 
    FETCH_CONVERSATION_LIST_SUCCESS, 
    FETCH_CONVERSATION_LIST_FAILURE
  } from './messageCONSTANTS';
  
  const initialState = {
    conversation: [],
    conversationList: [],
    loading: false,
    error: null
  };
  /*=============================================================
messageReducer
DESCRIPTION
    Handles state related to fetching and sending messages in a conversation.
PARAMETERS
    - state: The current state of the reducer.
    - action: The action dispatched to the reducer.
RETURNS
    The updated state with conversation, loading, or error information.
=============================================================*/
  export const messageReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_CONVERSATION_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      case FETCH_CONVERSATION_SUCCESS:
        return {
          ...state,
          conversation: action.payload,
          loading: false,
          error: null
        };
      case FETCH_CONVERSATION_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      case SEND_MESSAGE_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      case SEND_MESSAGE_SUCCESS:
        return {
          ...state,
          conversation: [action.payload,...state.conversation ],
          loading: false,
          error: null
        };
      case SEND_MESSAGE_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
     
      default:
        return state;
    }
  };
  


  const initialState2 = {
    conversationList: [],
    isLoading: false,
    error: null
  };
  /*=============================================================
conversationListReducer
DESCRIPTION
    Handles state related to listing conversations.
PARAMETERS
    - state: The current state of the reducer.
    - action: The action dispatched to the reducer.
RETURNS
    The updated state with conversationList, isLoading, or error information.
=============================================================*/
  export const conversationListReducer = (state = initialState2, action) => {
    switch (action.type) {
      case FETCH_CONVERSATION_LIST_REQUEST:
        return { ...state, isLoading: true };
      case FETCH_CONVERSATION_LIST_SUCCESS:
        return {
          ...state,
          isLoading: false,
          conversationList: action.payload,
          error: null
        };
      case FETCH_CONVERSATION_LIST_FAILURE:
        return {
          ...state,
          isLoading: false,
          conversationList: [],
          error: action.payload
        };
      default:
        return state;
    }
  }
  