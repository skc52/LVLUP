import axios from 'axios';
import {
    CREATE_CHALLENGE_REQUEST,
    CREATE_CHALLENGE_SUCCESS,
    CREATE_CHALLENGE_ERROR,
    CHALLENGE_LIST_REQUEST, 
    CHALLENGE_LIST_SUCCESS, 
    CHALLENGE_LIST_FAIL,
    GET_CHALLENGE_REQUEST, 
    GET_CHALLENGE_FAILURE, 
    GET_CHALLENGE_SUCCESS,
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
const config = { headers: { "Content-type": "application/json" }, withCredentials: true };

/*=============================================================
createChallenge()
NAME
    createChallenge - Creates a new challenge.
SYNOPSIS
    createChallenge = async (title, challenge, duration, tags) => {...};
    title -> The title of the challenge.
    challenge -> The challenge description.
    duration -> The challenge duration.
    tags -> Tags associated with the challenge.
DESCRIPTION
    This function attempts to create a new challenge by sending a POST request to the server's '/challenge/add' endpoint.
    It dispatches Redux actions to update the application state based on the creation outcome.
PARAMETERS
    title - The title of the challenge.
    challenge - The challenge description.
    duration - The challenge duration.
    tags - Tags associated with the challenge.
RETURNS
    None.
=============================================================*/
export const createChallenge = (title, challenge, duration, tags) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_CHALLENGE_REQUEST });
        console.log("HERE IN CHallenge action");
        const { data } = await axios.post(`${serverUrl}/challenge/add`, { title, challenge, duration, tags }, config);
        dispatch({ type: CREATE_CHALLENGE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: CREATE_CHALLENGE_ERROR, payload: error.response.data });
    }
};

/*=============================================================
listChallenges()
NAME
    listChallenges - Lists challenges based on keyword and tags.
SYNOPSIS
    listChallenges = async (keyword = "", tags) => {...};
    keyword -> A keyword to filter challenges.
    tags -> Tags to filter challenges by.
DESCRIPTION
    This function lists challenges based on a keyword and tags by sending a POST request to the server's '/challenge/all' endpoint.
    It dispatches Redux actions to update the application state with the list of challenges.
PARAMETERS
    keyword - A keyword to filter challenges.
    tags - Tags to filter challenges by.
RETURNS
    None.
=============================================================*/
export const listChallenges = (keyword = "", tags) => async (dispatch) => {
    try {
        console.log("Here in list challenges actions");
        dispatch({ type: CHALLENGE_LIST_REQUEST });
        let tagsCopy = []
        if (tags.length === 0) {
            tagsCopy = [""];
        } else {
            tagsCopy = tags;
        }

        const { data } = await axios.post(`${serverUrl}/challenge/all`, {
            keyword, tags: tagsCopy
        },
            config
        );
        console.log("HERE AFTEER");

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

/*=============================================================
listFollowedChallenges()
NAME
    listFollowedChallenges - Lists challenges followed by the user.
SYNOPSIS
    listFollowedChallenges = async (keyword = "", tags) => {...};
    keyword -> A keyword to filter challenges.
    tags -> Tags to filter challenges by.
DESCRIPTION
    This function lists challenges followed by the user based on a keyword and tags by sending a POST request to the server's '/challenge/feed' endpoint.
    It dispatches Redux actions to update the application state with the list of challenges.
PARAMETERS
    keyword - A keyword to filter challenges.
    tags - Tags to filter challenges by.
RETURNS
    None.
=============================================================*/
export const listFollowedChallenges = (keyword = "", tags) => async (dispatch) => {
    try {
        console.log("Here in list challenges actions");
        dispatch({ type: CHALLENGE_LIST_REQUEST });
        let tagsCopy = []
        if (tags.length === 0) {
            tagsCopy = [""];
        } else {
            tagsCopy = tags;
        }

        const { data } = await axios.post(`${serverUrl}/challenge/feed`, {
            keyword, tags: tagsCopy
        },
            config
        );
        console.log("HERE AFTEER");

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

/*=============================================================
listChallengesCreatedByMe()
NAME
    listChallengesCreatedByMe - Lists challenges created by the user.
SYNOPSIS
    listChallengesCreatedByMe = async (keyword = "", tags) => {...};
    keyword -> A keyword to filter challenges.
    tags -> Tags to filter challenges by.
DESCRIPTION
    This function lists challenges created by the user based on a keyword and tags by sending a POST request to the server's '/challenge/creator/me' endpoint.
    It dispatches Redux actions to update the application state with the list of challenges.
PARAMETERS
    keyword - A keyword to filter challenges.
    tags - Tags to filter challenges by.
RETURNS
    None.
=============================================================*/
export const listChallengesCreatedByMe = (keyword = "", tags) => async (dispatch) => {
    try {
        console.log("Here in list challenges actions");
        dispatch({ type: CHALLENGE_LIST_REQUEST });
        let tagsCopy = []
        if (tags.length === 0) {
            tagsCopy = [""];
        } else {
            tagsCopy = tags;
        }

        const { data } = await axios.post(`${serverUrl}/challenge/creator/me`, {
            keyword, tags: tagsCopy
        },
            config
        );
        console.log("HERE AFTEER");

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

/*=============================================================
getChallengeById()
NAME
    getChallengeById - Retrieves a challenge by ID.
SYNOPSIS
    getChallengeById = async (id) => {...};
    id -> The ID of the challenge to retrieve.
DESCRIPTION
    This function retrieves a challenge by ID by sending a GET request to the server's '/challenge/{id}' endpoint.
    It dispatches Redux actions to update the application state with the challenge information.
PARAMETERS
    id - The ID of the challenge to retrieve.
RETURNS
    None.
=============================================================*/
export const getChallengeById = (id) => async (dispatch) => {
    dispatch({ type: GET_CHALLENGE_REQUEST });

    try {
        console.log(id);

        const { data } = await axios.get(`${serverUrl}/challenge/${id}`, {
            withCredentials: true
        });
        console.log("DATA LOG", data.challenge.title);
        dispatch({ type: GET_CHALLENGE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: GET_CHALLENGE_FAILURE,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

/*=============================================================
upvoteChallenge()
NAME
    upvoteChallenge - Upvotes a challenge.
SYNOPSIS
    upvoteChallenge = async (challengeId) => {...};
    challengeId -> The ID of the challenge to upvote.
DESCRIPTION
    This function upvotes a challenge by sending a PUT request to the server's '/challenge/upvote/{challengeId}' endpoint.
    It dispatches Redux actions to update the application state based on the upvote outcome.
PARAMETERS
    challengeId - The ID of the challenge to upvote.
RETURNS
    None.
=============================================================*/
export const upvoteChallenge = (challengeId) => async (dispatch) => {
    try {
        console.log("Here in upvote");
        dispatch({ type: UPVOTE_CHALLENGE_REQUEST });
        const { data } = await axios.put(
            `${serverUrl}/challenge/upvote/${challengeId}`,
            {
                withCredentials: true
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

/*=============================================================
quitChallenge()
NAME
    quitChallenge - Quits a challenge.
SYNOPSIS
    quitChallenge = async (challengeId) => {...};
    challengeId -> The ID of the challenge to quit.
DESCRIPTION
    This function quits a challenge by sending a GET request to the server's '/challenge/quit/{challengeId}' endpoint.
    It dispatches Redux actions to update the application state based on the quit outcome.
PARAMETERS
    challengeId - The ID of the challenge to quit.
RETURNS
    None.
=============================================================*/
export const quitChallenge = (challengeId) => async (dispatch) => {
    try {
        console.log("ACTION IN QUIT TO");
        dispatch({ type: QUIT_CHALLENGE_REQUEST });
        const { data } = await axios.get(
            `${serverUrl}/challenge/quit/${challengeId}`,
            {
                withCredentials: true
            }
        );
        console.log("LOG QUIT", data.challenge);
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

/*=============================================================
joinChallenge()
NAME
    joinChallenge - Joins a challenge.
SYNOPSIS
    joinChallenge = async (challengeId) => {...};
    challengeId -> The ID of the challenge to join.
DESCRIPTION
    This function joins a challenge by sending a PUT request to the server's '/challenge/join/{challengeId}' endpoint.
    It dispatches Redux actions to update the application state based on the join outcome.
PARAMETERS
    challengeId - The ID of the challenge to join.
RETURNS
    None.
=============================================================*/
export const joinChallenge = (challengeId) => async (dispatch) => {
    try {
        console.log("ACTION IN JOIN TO");
        dispatch({ type: JOIN_CHALLENGE_REQUEST });
        const { data } = await axios.put(
            `${serverUrl}/challenge/join/${challengeId}`,
            {
                withCredentials: true
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

/*=============================================================
dailyCheckInOnAChallenge()
NAME
    dailyCheckInOnAChallenge - Records a daily check-in on a challenge.
SYNOPSIS
    dailyCheckInOnAChallenge = async (challengeId, message) => {...};
    challengeId -> The ID of the challenge to check in on.
    message -> The check-in message.
DESCRIPTION
    This function records a daily check-in on a challenge by sending a PUT request to the server's '/challenge/checkin/{challengeId}' endpoint.
    It dispatches Redux actions to update the application state based on the check-in outcome.
PARAMETERS
    challengeId - The ID of the challenge to check in on.
    message - The check-in message.
RETURNS
    None.
=============================================================*/
export const dailyCheckInOnAChallenge = (challengeId, message) => async (dispatch) => {
    try {
        console.log("ACTION IN CHECK IN TO");
        dispatch({ type: CHECKIN_CHALLENGE_REQUEST });
        const { data } = await axios.put(
            `${serverUrl}/challenge/checkin/${challengeId}`,
            { message },
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

/*=============================================================
getAllCheckedInMessages()
NAME
    getAllCheckedInMessages - Retrieves all checked-in messages for a challenge.
SYNOPSIS
    getAllCheckedInMessages = async (challengeId) => {...};
    challengeId -> The ID of the challenge to retrieve messages for.
DESCRIPTION
    This function retrieves all checked-in messages for a challenge by sending a GET request to the server's '/challenge/checkedin/messages/{challengeId}' endpoint.
    It dispatches Redux actions to update the application state with the messages.
PARAMETERS
    challengeId - The ID of the challenge to retrieve messages for.
RETURNS
    None.
=============================================================*/
export const getAllCheckedInMessages = (challengeId) => async (dispatch) => {
    try {
        console.log("ACTION IN get all checked in messages IN TO");
        dispatch({ type: GET_CHECKED_IN_MESSAGES_REQUEST });
        const { data } = await axios.get(
            `${serverUrl}/challenge/checkedin/messages/${challengeId}`,
            {
                withCredentials: true,
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

/*=============================================================
getMyStreaksForAChallenge()
NAME
    getMyStreaksForAChallenge - Retrieves user's streaks for a challenge.
SYNOPSIS
    getMyStreaksForAChallenge = async (challengeId) => {...};
    challengeId -> The ID of the challenge to retrieve streaks for.
DESCRIPTION
    This function retrieves user's streaks for a challenge by sending a GET request to the server's '/challenge/streak/{challengeId}' endpoint.
    It dispatches Redux actions to update the application state with the streaks information.
PARAMETERS
    challengeId - The ID of the challenge to retrieve streaks for.
RETURNS
    None.
=============================================================*/
export const getMyStreaksForAChallenge = (challengeId) => async (dispatch) => {
    try {
        console.log("ACTION IN get streaks IN TO");
        dispatch({ type: CHECK_STREAK_REQUEST });
        const { data } = await axios.get(
            `${serverUrl}/challenge/streak/${challengeId}`,
            {
                withCredentials: true,
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

/*=============================================================
completeChallenge()
NAME
    completeChallenge - Marks a challenge as completed.
SYNOPSIS
    completeChallenge = async (challengeId) => {...};
    challengeId -> The ID of the challenge to mark as completed.
DESCRIPTION
    This function marks a challenge as completed by sending a GET request to the server's '/challenge/complete/{challengeId}' endpoint.
    It dispatches Redux actions to update the application state based on the completion outcome.
PARAMETERS
    challengeId - The ID of the challenge to mark as completed.
RETURNS
    None.
=============================================================*/
export const completeChallenge = (challengeId) => async (dispatch) => {
    try {
        console.log("ACTION IN completing challenge IN TO");
        dispatch({ type: COMPLETE_CHALLENGE_REQUEST });
        const { data } = await axios.get(
            `${serverUrl}/challenge/complete/${challengeId}`,
            {
                withCredentials: true,
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

/*=============================================================
fetchAllChallengesIHaveInteractedWith()
NAME
    fetchAllChallengesIHaveInteractedWith - Retrieves all challenges interacted with by the user.
SYNOPSIS
    fetchAllChallengesIHaveInteractedWith = async (userId) => {...};
    userId -> The ID of the user to retrieve challenges for.
DESCRIPTION
    This function retrieves all challenges interacted with by the user by sending a POST request to the server's '/challenge/all/profile' endpoint.
    It dispatches Redux actions to update the application state with the challenges information.
PARAMETERS
    userId - The ID of the user to retrieve challenges for.
RETURNS
    None.
=============================================================*/
export const fetchAllChallengesIHaveInteractedWith = (userId) => async (dispatch) => {
    try {
        console.log("ACTION IN fetchings challenge IN TO");
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

/*=============================================================
clearMsg()
NAME
    clearMsg - Clears a message.
SYNOPSIS
    clearMsg = () => {...};
DESCRIPTION
    This function clears a message by dispatching a Redux action to clear the message in the application state.
PARAMETERS
    None.
RETURNS
    None.
=============================================================*/
export const clearMsg = () => async (dispatch) => {
    dispatch({ type: CLEAR_MSG });
};
