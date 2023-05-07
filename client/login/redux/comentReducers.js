// UNNECESSARY CODE
import {
    COMMENT_CREATE_REQUEST,
    COMMENT_CREATE_SUCCESS,
    COMMENT_CREATE_FAIL,
    COMMENT_ALL_REQUEST,
    COMMENT_ALL_SUCCESS,
    COMMENT_ALL_FAIL
  
  } from './commentConstants.js';


const initialState = {
    comments: [],
    loading: false,
    error: null,
  };
  
  export const commentReducer = (state = initialState, action) => {
    switch (action.type) {
        case COMMENT_CREATE_REQUEST:
            case COMMENT_ALL_REQUEST:
            return {
                ...state,
                loading:true
            }
            case COMMENT_ALL_SUCCESS:
                return {
                   
                    loading:false,
                    comments:[...action.payload.comments]
                }
            case COMMENT_CREATE_SUCCESS:
                return {
                   
                    loading:false,
                    comments: [...state.comments, action.payload.comment]
                }
            case COMMENT_CREATE_FAIL:
                case COMMENT_ALL_FAIL:
                return {
                   
                    loading:false,
                    error:action.payload
                }
      
      default:
        return state;
    }
  };
  

