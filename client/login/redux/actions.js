import axios from "axios";

const serverUrl = `http://192.168.63.115:4000/api/v1`;

/**/
/*
login()
NAME
    login - Handles user login.
SYNOPSIS
    login = async (email, password, dispatch) => {...};
    email -> The user's email address for authentication.
    password -> The user's password for authentication.
    dispatch -> Redux dispatch function to update the application state.
DESCRIPTION
    This function attempts to log in a user by sending a POST request to the server's login endpoint.
    It dispatches Redux actions to update the application state based on the login outcome.
PARAMETERS
    email - User's email address.
    password - User's password.
    dispatch - Redux dispatch function.
RETURNS
    None.
*/
/**/
export const login  = (email, password) => async(dispatch) => {
    try {
        
        dispatch({type:"loginRequest"});
        console.log("her2e")
        const config = {headers:{"Content-type":"application/json"},  withCredentials: true};

        const {data} = await axios.post(
            `${serverUrl}/login`, 
            {email, password},
            config
        ) 

        dispatch({type:"loginSuccess", payload:data });
        
    } catch (error) {
        dispatch({type:"loginFail", payload:error.response.data.message});
    }
}
/*login = async (email, password, dispatch) => {...};*/


/*=============================================================
logout()
NAME
    logout - Handles user logout.
SYNOPSIS
    logout = async () => {...};
DESCRIPTION
    This function attempts to log out a user by sending a GET request to the server's logout endpoint.
    It dispatches Redux actions to update the application state based on the logout outcome.
PARAMETERS
    None.
RETURNS
    None.
=============================================================*/
export const logout  = () => async(dispatch) => {
    try {
        dispatch({type:"logoutRequest"});
        const config = {  withCredentials: true};

        const {data} = await axios.get(
            `${serverUrl}/logout`, 
            config
        ) 
        console.log("logout")

        dispatch({type:"logoutSuccess", payload:data })
    } catch (error) {
        dispatch({type:"logoutFail", payload:error.response.data.message})
    }
}
/*logout = async () => {...}; */

/*=============================================================
loadUser()
NAME
    loadUser - Loads user data.
SYNOPSIS
    loadUser = async () => {...};
DESCRIPTION
    This function attempts to load user data by sending a GET request to the server's '/me' endpoint.
    It dispatches Redux actions to update the application state based on the load user data outcome.
PARAMETERS
    None.
RETURNS
    None.

=============================================================*/
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: "loadUserRequest" });
        const { data } = await axios.get(
            `${serverUrl}/me`,
            { withCredentials: true }
        );

        dispatch({ type: "loadUserSuccess", payload: data });
    } catch (error) {
        dispatch({ type: "loadUserFail", payload: error.response.data.error });
    }
}
/*loadUser = async () => {...};*/


/*=============================================================
registerUser()
NAME
    registerUser - Registers a new user.
SYNOPSIS
    registerUser = async (email, password, name, avatar) => {...};
    email -> The user's email address for registration.
    password -> The user's password for registration.
    name -> The user's name for registration.
    avatar -> The user's avatar for registration.
DESCRIPTION
    This function attempts to register a new user by sending a POST request to the server's register endpoint.
    It dispatches Redux actions to update the application state based on the registration outcome.
PARAMETERS
    email - User's email address for registration.
    password - User's password for registration.
    name - User's name for registration.
    avatar - User's avatar for registration.
RETURNS
    None.
=============================================================*/
export const registerUser = (email, password, name, avatar) => async (dispatch) => {
    try {
        console.log("HERE IN REGISTER USER ACTION");
        dispatch({ type: "registerRequest" });
        const config = { headers: { "Content-type": "application/json" }, withCredentials: true };

        const lat = 32.22;
        const long = 32.22;
        const { data } = await axios.post(
            `${serverUrl}/register`,
            { email, password, name, avatar, lat, long },
            config
        );

        dispatch({ type: "registerSuccess", payload: data });

    } catch (error) {
        dispatch({ type: "registerFail", payload: error.response.data.message });
    }
}
/*registerUser = async (email, password, name, avatar) => {...};*/



/*=============================================================
updateUser()
NAME
    updateUser - Updates user information.
SYNOPSIS
    updateUser = async (name, avatar, avatarUpdateBool, base64Image) => {...};
    name -> The updated user's name.
    avatar -> The updated user's avatar.
    avatarUpdateBool -> A boolean indicating if the avatar should be updated.
    base64Image -> The base64-encoded image data for avatar.
DESCRIPTION
    This function attempts to update user information by sending a POST request to the server's '/me/update' endpoint.
    It dispatches Redux actions to update the application state based on the update outcome.
PARAMETERS
    name - The updated user's name.
    avatar - The updated user's avatar.
    avatarUpdateBool - A boolean indicating if the avatar should be updated.
    base64Image - The base64-encoded image data for avatar.
RETURNS
    None.
=============================================================*/
export const updateUser = (name, avatar, avatarUpdateBool, base64Image) => async (dispatch) => {
    try {
        console.log("HERE IN UPDATE USER ACTION");
        dispatch({ type: "updateRequest" });
        const config = { headers: { "Content-type": "application/json" }, withCredentials: true };

        console.log(base64Image);
        const { data } = await axios.post(
            `${serverUrl}/me/update`,
            { name, avatar, avatarUpdateBool, base64Image },
            config
        );

        console.log(data.user);
        dispatch({ type: "updateSuccess", payload: data });

    } catch (error) {
        dispatch({ type: "updateFail", payload: error.response.data.message });
    }
}
/*updateUser = async (name, avatar, avatarUpdateBool, base64Image) => {...};*/



/*=============================================================
clearUpdate()
NAME
    clearUpdate - Clears the update status.
SYNOPSIS
    clearUpdate = () => {...};
DESCRIPTION
    This function clears the update status by dispatching a Redux action to reset it.
PARAMETERS
    None.
RETURNS
    None.
=============================================================*/
export const clearUpdate = () => async (dispatch) => {
    dispatch({ type: "clearUpdate" });
}
/*clearUpdate = () => {...};*/



/*=============================================================
sendActivateOtp()
NAME
    sendActivateOtp - Sends an activation OTP (One-Time Password).
SYNOPSIS
    sendActivateOtp = () => {...};
DESCRIPTION
    This function sends an activation OTP by sending a GET request to the server's '/me/sendactivateOTP' endpoint.
    It dispatches Redux actions to update the application state based on the outcome of sending the activation OTP.
PARAMETERS
    None.
RETURNS
    None.
=============================================================*/
export const sendActivateOtp = () => async (dispatch) => {
    try {
        dispatch({ type: "sendActivateRequest" });
        const config = { withCredentials: true };

        const { data } = await axios.get(
            `${serverUrl}/me/sendactivateOTP`,
            config
        );

        dispatch({ type: "sendActivateSuccess", payload: data });

    } catch (error) {
        dispatch({ type: "sendActivateFail", payload: error.response.data.message });
    }
}
/*sendActivateOtp = () => {...};*/

/*=============================================================
activateAccount()
NAME
    activateAccount - Activates a user account.
SYNOPSIS
    activateAccount = async (activateOTP) => {...};
    activateOTP -> The activation OTP (One-Time Password) provided by the user.
DESCRIPTION
    This function activates a user account by sending a POST request to the server's '/me/activate' endpoint.
    It dispatches Redux actions to update the application state based on the activation outcome.
PARAMETERS
    activateOTP - The activation OTP provided by the user.
RETURNS
    None.
=============================================================*/
export const activateAccount = (activateOTP) => async (dispatch) => {
    try {
        dispatch({ type: "activateRequest" });
        const config = { headers: { "Content-type": "application/json" }, withCredentials: true };

        const { data } = await axios.post(
            `${serverUrl}/me/activate`,
            { activateOTP },
            config
        );

        dispatch({ type: "activateSuccess", payload: data });
    } catch (error) {
        dispatch({ type: "activateFail", payload: error.response.data.message });
    }
}
/*activateAccount = async (activateOTP) => {...};*/



/*=============================================================
changePw()
NAME
    changePw - Changes user password.
SYNOPSIS
    changePw = async (prevpassword, newpassword) => {...};
    prevpassword -> The user's current password.
    newpassword -> The new password to be set.
DESCRIPTION
    This function changes a user's password by sending a POST request to the server's '/changePassword' endpoint.
    It dispatches Redux actions to update the application state based on the password change outcome.
PARAMETERS
    prevpassword - The user's current password.
    newpassword - The new password to be set.
RETURNS
    None.
=============================================================*/
export const changePw = (prevpassword, newpassword) => async (dispatch) => {
    try {
        dispatch({ type: "changePwRequest" });
        const config = { headers: { "Content-type": "application/json" }, withCredentials: true };
        console.log("here in change pw");

        const { data } = await axios.post(
            `${serverUrl}/changePassword`,
            { prevpassword, newpassword },
            config
        );
        dispatch({ type: "changePwSuccess", payload: data });
    } catch (error) {
        dispatch({ type: "changePwFail", payload: error.response.data.message });
    }
}
/*changePw = async (prevpassword, newpassword) => {...};*/

/*=============================================================
sendResetEmail()
NAME
    sendResetEmail - Sends a password reset email.
SYNOPSIS
    sendResetEmail = async (email) => {...};
    email -> The user's email address for sending the reset email.
DESCRIPTION
    This function sends a password reset email by sending a POST request to the server's '/sendResetPasswordOTP' endpoint.
    It dispatches Redux actions to update the application state based on the outcome of sending the reset email.
PARAMETERS
    email - The user's email address for sending the reset email.
RETURNS
    None.
=============================================================*/
export const sendResetEmail = (email) => async (dispatch) => {
    try {
        dispatch({ type: "sendResetRequest" });
        const config = { headers: { "Content-type": "application/json" } };
        
        const { data } = await axios.post(
            `${serverUrl}/sendResetPasswordOTP`,
            { email },
            config
        );

        console.log("here in send reset success");

        dispatch({ type: "sendResetSuccess", payload: data });
    } catch (error) {
        dispatch({ type: "sendResetFail", payload: error.response.data.message });
    }
}
/*sendResetEmail = async (email) => {...};*/

/*=============================================================
resetPw()
NAME
    resetPw - Resets user password.
SYNOPSIS
    resetPw = async (email, resetPasswordOTP, newpassword) => {...};
    email -> The user's email address for password reset.
    resetPasswordOTP -> The reset password OTP (One-Time Password) provided by the user.
    newpassword -> The new password to be set.
DESCRIPTION
    This function resets a user's password by sending a POST request to the server's '/resetPassword' endpoint.
    It dispatches Redux actions to update the application state based on the password reset outcome.
PARAMETERS
    email - The user's email address for password reset.
    resetPasswordOTP - The reset password OTP provided by the user.
    newpassword - The new password to be set.
RETURNS
    None.
=============================================================*/
export const resetPw = (email, resetPasswordOTP, newpassword) => async (dispatch) => {
    try {
        console.log("reset pw ");

        dispatch({ type: "resetPwRequest" });
        const config = { headers: { "Content-type": "application/json" } };

        const { data } = await axios.post(
            `${serverUrl}/resetPassword`,
            { email, resetPasswordOTP, newpassword },
            config
        );
        console.log("reset pw success");

        dispatch({ type: "resetPwSuccess", payload: data });
    } catch (error) {
        dispatch({ type: "resetPwFail", payload: error.response.data.message });
    }
}

/*clearReset()
NAME
    clearReset - Clears the reset status.
SYNOPSIS
    clearReset = () => {...};
DESCRIPTION
    This function clears the reset status by dispatching a Redux action to reset it.
PARAMETERS
    None.
RETURNS
    None.
=============================================================*/
export const clearReset = () => async (dispatch) => {
    dispatch({ type: "clearReset" });
}

/*=============================================================
sendFollowRequest()
NAME
    sendFollowRequest - Sends a follow request.
SYNOPSIS
    sendFollowRequest = async (id) => {...};
    id -> The user ID of the recipient.
DESCRIPTION
    This function sends a follow request by sending a PUT request to the server's '/connect/request/send/{id}' endpoint.
    It dispatches Redux actions to update the application state based on the follow request outcome.
PARAMETERS
    id - The user ID of the recipient.
RETURNS
    None.
=============================================================*/
export const sendFollowRequest = (id) => async (dispatch) => {
    try {
        console.log("Sent request");

        dispatch({ type: "sendFollowRequest" });
        const config = { withCredentials: true };

        const { data } = await axios.put(
            `${serverUrl}/connect/request/send/${id}`,
            config
        );

        dispatch({ type: "sendFollowSuccess", payload: data });
    } catch (error) {
        dispatch({ type: "sendFollowFail", payload: error.response.data.message });
    }
}

/*clearSendSuccess()
NAME
    clearSendSuccess - Clears the send follow request success status.
SYNOPSIS
    clearSendSuccess = () => {...};
DESCRIPTION
    This function clears the send follow request success status by dispatching a Redux action to reset it.
PARAMETERS
    None.
RETURNS
    None.
=============================================================*/
export const clearSendSuccess = () => async (dispatch) => {
    dispatch({ type: "clearSendSuccess" });
}



/*=============================================================
acceptFollowRequest()
NAME
    acceptFollowRequest - Accepts a follow request.
SYNOPSIS
    acceptFollowRequest = async (id) => {...};
    id -> The user ID of the follower.
DESCRIPTION
    This function accepts a follow request by sending a PUT request to the server's '/connect/request/accept/{id}' endpoint.
    It dispatches Redux actions to update the application state based on the acceptance outcome.
PARAMETERS
    id - The user ID of the follower.
RETURNS
    None.
=============================================================*/
export const acceptFollowRequest = (id) => async (dispatch) => {
    try {
        console.log("here in accept follow action");

        dispatch({ type: "acceptFollowRequest" });
        const config = { withCredentials: true };

        const { data } = await axios.put(
            `${serverUrl}/connect/request/accept/${id}`,
            config
        );

        console.log("accepted");

        dispatch({ type: "acceptFollowSuccess", payload: data });
    } catch (error) {
        dispatch({ type: "acceptFollowFail", payload: error.response.data.message });
    }
}

/*clearAcceptSuccess()
NAME
    clearAcceptSuccess - Clears the accept follow request success status.
SYNOPSIS
    clearAcceptSuccess = () => {...};
DESCRIPTION
    This function clears the accept follow request success status by dispatching a Redux action to reset it.
PARAMETERS
    None.
RETURNS
    None.
=============================================================*/
export const clearAcceptSuccess = () => async (dispatch) => {
    dispatch({ type: "clearAcceptSuccess" });
}

/*=============================================================
unFollow()
NAME
    unFollow - Unfollows a user.
SYNOPSIS
    unFollow = async (id) => {...};
    id -> The user ID of the user to unfollow.
DESCRIPTION
    This function unfollows a user by sending a PUT request to the server's '/connect/unfollow/{id}' endpoint.
    It dispatches Redux actions to update the application state based on the unfollow outcome.
PARAMETERS
    id - The user ID of the user to unfollow.
RETURNS
    None.
=============================================================*/
export const unFollow = (id) => async (dispatch) => {
    try {
        dispatch({ type: "unFollowRequest" });
        const config = { withCredentials: true };

        const { data } = await axios.put(
            `${serverUrl}/connect/unfollow/${id}`,
            config
        );

        dispatch({ type: "unFollowSuccess", payload: data });
    } catch (error) {
        dispatch({ type: "unFollowFail", payload: error.response.data.message });
    }
}

/*clearUnfollowSuccess()
NAME
    clearUnfollowSuccess - Clears the unfollow success status.
SYNOPSIS
    clearUnfollowSuccess = () => {...};
DESCRIPTION
    This function clears the unfollow success status by dispatching a Redux action to reset it.
PARAMETERS
    None.
RETURNS
    None.
=============================================================*/
export const clearUnfollowSuccess = () => async (dispatch) => {
    dispatch({ type: "clearUnfollowSuccess" });
}

/*=============================================================
removeFollowing()
NAME
    removeFollowing - Removes a user from following list.
SYNOPSIS
    removeFollowing = async (id) => {...};
    id -> The user ID of the user to be removed from following list.
DESCRIPTION
    This function removes a user from the following list by sending a PUT request to the server's '/connect/removeFollowing/{id}' endpoint.
    It dispatches Redux actions to update the application state based on the removal outcome.
PARAMETERS
    id - The user ID of the user to be removed from following list.
RETURNS
    None.
=============================================================*/
export const removeFollowing = (id) => async (dispatch) => {
    try {
        dispatch({ type: "removeFollowRequest" });
        const config = { withCredentials: true };

        const { data } = await axios.put(
            `${serverUrl}/connect/removeFollowing/${id}`,
            config
        );

        dispatch({ type: "removeFollowSuccess", payload: data });
    } catch (error) {
        dispatch({ type: "removeFollowFail", payload: error.response.data.message });
    }
}

/*=============================================================
getAllUsersSearch()
NAME
    getAllUsersSearch - Retrieves a list of users based on search criteria.
SYNOPSIS
    getAllUsersSearch = async (name) => {...};
    name -> The search criteria (user name) to filter the list of users.
DESCRIPTION
    This function retrieves a list of users based on search criteria by sending a POST request to the server's '/users/search' endpoint.
    It dispatches Redux actions to update the application state with the search results.
PARAMETERS
    name - The search criteria (user name) to filter the list of users.
RETURNS
    None.
=============================================================*/
export const getAllUsersSearch = (name) => async (dispatch) => {
    try {
        dispatch({ type: "searchUsersRequest" });
        const config = { headers: { "Content-type": "application/json" }, withCredentials: true };

        const { data } = await axios.post(
            `${serverUrl}/users/search`,
            { name },
            config
        );

        dispatch({ type: "searchUsersSuccess", payload: data });

    } catch (error) {
        dispatch({ type: "searchUsersFail", payload: error.response.data.message });
    }
}

/*=============================================================
getAllFollowRequests()
NAME
    getAllFollowRequests - Retrieves a list of follow requests.
SYNOPSIS
    getAllFollowRequests = async () => {...};
DESCRIPTION
    This function retrieves a list of follow requests by sending a GET request to the server's '/me/followRequests' endpoint.
    It dispatches Redux actions to update the application state with the follow requests.
PARAMETERS
    None.
RETURNS
    None.
=============================================================*/
export const getAllFollowRequests = () => async (dispatch) => {
    try {
        dispatch({ type: "searchUsersRequest" });
        const config = { headers: { "Content-type": "application/json" }, withCredentials: true };

        const { data } = await axios.get(
            `${serverUrl}/me/followRequests`,
            config
        );
        console.log(data?.users);
        dispatch({ type: "searchUsersSuccess", payload: data });

    } catch (error) {
        dispatch({ type: "searchUsersFail", payload: error.response.data.message });
    }
}

/*=============================================================
getAUser()
NAME
    getAUser - Retrieves a user by ID.
SYNOPSIS
    getAUser = async (id) => {...};
    id -> The user ID to retrieve.
DESCRIPTION
    This function retrieves a user by ID by sending a GET request to the server's '/user/{id}' endpoint.
    It dispatches Redux actions to update the application state with the user information.
PARAMETERS
    id - The user ID to retrieve.
RETURNS
    None.
=============================================================*/
export const getAUser = (id) => async (dispatch) => {
    try {
        console.log("Here in ");
        dispatch({ type: "getAUserRequest" });
        const { data } = await axios.get(
            `${serverUrl}/user/${id}`,
            { withCredentials: true }
        );
        console.log(data);

        dispatch({ type: "getAUserSuccess", payload: data });
    } catch (error) {
        dispatch({ type: "getAUserFail", payload: error.response.data.error });
    }
}

/*=============================================================
getNoMessageUsers()
NAME
    getNoMessageUsers - Retrieves a list of users with no messages.
SYNOPSIS
    getNoMessageUsers = async () => {...};
DESCRIPTION
    This function retrieves a list of users with no messages by sending a GET request to the server's '/messages/no' endpoint.
    It dispatches Redux actions to update the application state with the list of users.
PARAMETERS
    None.
RETURNS
    None.
=============================================================*/
export const getNoMessageUsers = () => async (dispatch) => {
    try {
        dispatch({ type: "searchUsersRequest" });
        const config = { withCredentials: true };

        const { data } = await axios.get(
            `${serverUrl}/messages/no`,
            config
        );
        dispatch({ type: "searchUsersSuccess", payload: data });

    } catch (error) {
        dispatch({ type: "searchUsersFail", payload: error.response.data.message });
    }
}
