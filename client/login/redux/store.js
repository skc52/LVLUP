import { configureStore, getDefaultMiddleware  } from "@reduxjs/toolkit";
import { authReducer, activateReducer , pwReducer, followReducer, getUsers, getAUser, updateUser} from "./reducers";

import {messageReducer, conversationListReducer} from './messageReducers.js'
import {createChallengeReducer, challengeListReducer, challengeReducer, checkedInMessagesReducer
    , streakReducer,challengesReducer, 
} from './challengeReducers.js'

import { postReducer } from "./postReducers";
import { commentReducer } from "./comentReducers";
const store= configureStore({
    reducer:{
        auth:authReducer,
        activate:activateReducer,
        pw:pwReducer,
        follow:followReducer,
        users:getUsers,
        user:getAUser,
        // updateUser:updateUser
        message:messageReducer,
        conversationList:conversationListReducer,
        challengeList:challengeListReducer,
        createChallenge:createChallengeReducer,
        challenge:challengeReducer,
        checkedInMessages: checkedInMessagesReducer,
        streak:streakReducer,
        fetchChallenges:challengesReducer,
        posts:postReducer,
        comment:commentReducer
        // upvoteChallenge:upvoteChallengeReducer


        
    },
    middleware: getDefaultMiddleware({
        immutableCheck: false,
      }),
})

export default store;