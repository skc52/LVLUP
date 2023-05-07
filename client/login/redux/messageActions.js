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

export const sendMessage = (id, text, senderName) => async dispatch => {
  dispatch({ type: SEND_MESSAGE_REQUEST });
  try { 
    
   
    const config = {headers:{"Content-type":"application/json"},  withCredentials: true};

    const {data} = await axios.post(`${serverUrl}/message/create/${id}`, { 
      recipient:id,
      text:text
     },
     config
     
     );

     

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



