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

import {
    COMMENT_CREATE_REQUEST,
    COMMENT_CREATE_SUCCESS,
    COMMENT_CREATE_FAIL,
    COMMENT_ALL_REQUEST,
    COMMENT_ALL_SUCCESS,
    COMMENT_ALL_FAIL
  
  } from './commentConstants.js';

  
const initialState = {
    posts: [],
    loading: false,
    error: null,
    isCreated:false
  };
  
  export const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_GET_ALL_REQUEST:
            case POST_LIKE_REQUEST:
                case COMMENT_CREATE_REQUEST:
                    case POST_CREATE_REQUEST:
                        case POST_UPDATE_REQUEST:
            return {
                ...state,
                loading:true
            }
            case POST_GET_ALL_SUCCESS:
                return {
                   
                    loading:false,
                    posts:[...action.payload.posts]
                }
            case POST_LIKE_SUCCESS:
                return {
                   
                    loading:false,
                    posts:state.posts.map((post)=>{
                        if (post._id.toString()===action.payload.post._id.toString()){
                            return action.payload.post;
                        } else {
                          return post;
                    }})
                }

            case COMMENT_CREATE_SUCCESS:
                return {
                    loading:false,
                    posts:state.posts.map((post)=>{
                        if (post._id.toString()===action.payload.post._id.toString()){
                            return action.payload.post;
                        } else {
                          return post;
                    }})
                }

            case POST_CREATE_SUCCESS:
                case POST_UPDATE_SUCCESS:
                    return {

                        ...state,
                       loading:false,
                       isCreated:true,
                    }
            
            case POST_GET_ALL_FAIL:
                case POST_LIKE_FAIL:
                    case COMMENT_CREATE_FAIL:
                        
                return {
                   
                    loading:false,
                    error:action.payload
                }
            case POST_CREATE_FAIL:
                case POST_UPDATE_FAIL:
                    return {
                        loading:false,
                        error:action.payload.error,
                        isCreated:false
                    }
      
      default:
        return state;
    }
  };
  

