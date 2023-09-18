/*=============================================================
Message Reducers
DESCRIPTION
    Handles state related to fetching conversations, sending messages, and listing conversations.
PARAMETERS
    - state: The current state of the reducer.
    - action: The action dispatched to the reducer.
RETURNS
    The updated state with loading, conversation data, message data, or error information.
=============================================================*/
const serverUrl = `http://192.168.63.115:4000/api/v1`;

import axios from 'axios';
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

/*=============================================================
fetchConversation
DESCRIPTION
    Fetches a conversation by its ID.
PARAMETERS
    - id: The ID of the conversation to fetch.
RETURNS
    Dispatches actions based on the API response.
=============================================================*/
export const fetchConversation = (id) => async dispatch => {
  dispatch({ type: FETCH_CONVERSATION_REQUEST });
  try {
    console.log("TRYING TO FETCH CONVO", id)
    
    const {data} = await axios.get(`${serverUrl}/conversation/${id}`);
    dispatch({
      type: FETCH_CONVERSATION_SUCCESS,
      payload: data
    });

    console.log(data);
  } catch (err) {
    dispatch({
      type: FETCH_CONVERSATION_FAILURE,
      payload: err.response.data.message
    });
  }
};

/*=============================================================
sendMessage
DESCRIPTION
    Sends a message to a conversation by its ID.
PARAMETERS
    - id: The ID of the conversation to send the message to.
    - text: The message text to send.
    - senderName: The name of the sender.
RETURNS
    Dispatches actions based on the API response.
=============================================================*/
export const sendMessage = (id, text, senderName) => async dispatch => {
  dispatch({ type: SEND_MESSAGE_REQUEST });
  try { 
    const config = {headers:{"Content-type":"application/json"},  withCredentials: true};

    const {data} = await axios.post(`${serverUrl}/message/create/${id}`, { 
      recipient: id,
      text: text
    },
    config);

    dispatch({
      type: SEND_MESSAGE_SUCCESS,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: SEND_MESSAGE_FAILURE,
      payload: err.response.data.message
    });
  }
};

/*=============================================================
fetchConversationList
DESCRIPTION
    Fetches a list of conversations based on a user's name.
PARAMETERS
    - name: The name of the user to fetch conversations for.
RETURNS
    Dispatches actions based on the API response.
=============================================================*/
export const fetchConversationList = (name) => async dispatch => {
  dispatch({ type: FETCH_CONVERSATION_LIST_REQUEST });
  try { 
    const config = {headers:{"Content-type":"application/json"},  withCredentials: true};
    const {data} = await axios.post(`${serverUrl}/conversations`, 
    {
      name
    },
     config
     );

    dispatch({
      type: FETCH_CONVERSATION_LIST_SUCCESS,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: FETCH_CONVERSATION_LIST_FAILURE,
      payload: err.response.data.message
    });
  }
};
