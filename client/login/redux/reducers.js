/*=============================================================
authReducer
DESCRIPTION
    Handles state related to user authentication, including login, logout, and registration.
PARAMETERS
    - state: The current state of the reducer.
    - action: The action dispatched to the reducer.
RETURNS
    The updated state with loading, isAuthenticated, user, message, or error information.
=============================================================*/
import { createReducer } from "@reduxjs/toolkit";

export const authReducer = createReducer({}, {
    loginRequest: (state, action) => {
        state.loading = true;
    },
    loginSuccess: (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
    },
    loginFail: (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
    },

    logoutRequest: (state, action) => {
        state.loading = true;
    },
    logoutSuccess: (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
    },
    logoutFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    registerRequest: (state) => {
        state.loading = true;
    },
    registerSuccess: (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
    },
    registerFailure: (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
    },
    loadUserRequest: (state) => {
        state.loading = true;
    },
    loadUserSuccess: (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
    },
    loadUserFail: (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
    },
    updateRequest: (state) => {
        state.loading = true;
    },
    updateSuccess: (state, action) => {
        state.loading = false;
        state.isUpdated = true;
        state.user = action.payload.user;
    },
    updateFail: (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.payload;
    },
    clearUpdate: (state) => {
        state.isUpdated = false;
    },
    clearError: (state) => {
        state.error = null;
    },
    clearMessage: (state) => {
        state.message = null;
    }
})

/*=============================================================
updateUser
DESCRIPTION
    Handles state related to updating user information.
PARAMETERS
    - state: The current state of the reducer.
    - action: The action dispatched to the reducer.
RETURNS
    The updated state with loading, isUpdated, user, or error information.
=============================================================*/
export const updateUser = createReducer({}, {
    updateRequest: (state) => {
        state.loading = true;
    },
    updateSuccess: (state, action) => {
        state.loading = false;
        state.isUpdated = true;
        state.user = action.payload.user;
    },
    updateFail: (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.payload;
    },
    clearUpdate: (state) => {
        state.isUpdated = false;
    },
    clearError: (state) => {
        state.error = null;
    }
})

/*=============================================================
getAUser
DESCRIPTION
    Handles state related to fetching a user's information.
PARAMETERS
    - state: The current state of the reducer.
    - action: The action dispatched to the reducer.
RETURNS
    The updated state with loading, profileUser, isAuthenticated, or error information.
=============================================================*/
export const getAUser = createReducer({}, {
    getAUserRequest: (state) => {
        state.loading = true;
    },
    getAUserSuccess: (state, action) => {
        state.loading = false;
        state.profileUser = action.payload.user;
    },
    getAUserFail: (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
    },
    clearError: (state) => {
        state.error = null;
    },
    clearMessage: (state) => {
        state.message = null;
    }
})

/*=============================================================
activateReducer
DESCRIPTION
    Handles state related to user activation.
PARAMETERS
    - state: The current state of the reducer.
    - action: The action dispatched to the reducer.
RETURNS
    The updated state with loading, success, message, or error information.
=============================================================*/
export const activateReducer = createReducer({}, {
    sendActivateRequest: (state, action) => {
        state.loading = true;
    },
    sendActivateSuccess: (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
    },
    sendActivateFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    activateRequest: (state) => {
        state.loading = true;
    },
    activateSuccess: (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
    },
    activateFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearError: (state) => {
        state.error = null;
    },
    clearMessage: (state) => {
        state.message = null;
    }
})

/*=============================================================
pwReducer
DESCRIPTION
    Handles state related to password change and reset.
PARAMETERS
    - state: The current state of the reducer.
    - action: The action dispatched to the reducer.
RETURNS
    The updated state with loading, success, isUpdated, message, or error information.
=============================================================*/
export const pwReducer = createReducer({}, {
    changePwRequest: (state, action) => {
        state.loading = true;
    },
    changePwSuccess: (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.isUpdated = true;
        state.message = action.payload.message;
    },
    changePwFail: (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.payload;
    },
    sendResetRequest: (state) => {
        state.loading = true;
    },
    sendResetSuccess: (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
    },
    sendResetFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    resetPwRequest: (state, action) => {
        state.loading = true;
    },
    resetPwSuccess: (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.isUpdated = true;
        state.message = action.payload.message;
    },
    resetPwFail: (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.payload;
    },
    clearReset: (state) => {
        state.isUpdated = false;
        state.success = false;
    },
    clearError: (state) => {
        state.error = null;
    },
    clearMessage: (state) => {
        state.message = null;
    }
})

/*=============================================================
followReducer
DESCRIPTION
    Handles state related to following/unfollowing users.
PARAMETERS
    - state: The current state of the reducer.
    - action: The action dispatched to the reducer.
RETURNS
    The updated state with loading, sendReqSuccess, acceptReqSuccess, unfollowSuccess, user2, message, or error information.
=============================================================*/
export const followReducer = createReducer({}, {
    sendFollowRequest: (state, action) => {
        state.loading = true;
    },
    sendFollowSuccess: (state, action) => {
        state.loading = false;
        state.sendReqSuccess = true;
        state.message = action.payload.message;
        state.user2 = action.payload.user;
    },
    sendFollowFail: (state, action) => {
        state.loading = false;
        state.sendReqSuccess = false;
        state.error = action.payload;
    },
    clearSendSuccess: (state) => {
        state.sendReqSuccess = false;
    },
    acceptFollowRequest: (state, action) => {
        state.loading = true;
    },
    acceptFollowSuccess: (state, action) => {
        state.loading = false;
        state.acceptReqSuccess = true;
        state.message = action.payload.message;
    },
    acceptFollowFail: (state, action) => {
        state.loading = false;
        state.acceptReqSuccess = false;
        state.error = action.payload;
    },
    clearAcceptSuccess: (state) => {
        state.acceptReqSuccess = false;
    },
    unFollowRequest: (state, action) => {
        state.loading = true;
    },
    unFollowSuccess: (state, action) => {
        state.loading = false;
        state.unfollowSuccess = true;
        state.message = action.payload.message;
        state.user2 = action.payload.user;
    },
    unFollowFail: (state, action) => {
        state.loading = false;
        state.unfollowSuccess = false;
        state.error = action.payload;
    },
    clearUnfollowSuccess: (state) => {
        state.unfollowSuccess = false;
    },
    removeFollowRequest: (state, action) => {
        state.loading = true;
    },
    removeFollowSuccess: (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
    },
    removeFollowFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearError: (state) => {
        state.error = null;
    },
    clearMessage: (state) => {
        state.message = null;
    }
})

/*=============================================================
getUsers
DESCRIPTION
    Handles state related to searching for users.
PARAMETERS
    - state: The current state of the reducer.
    - action: The action dispatched to the reducer.
RETURNS
    The updated state with loading, success, users, message, or error information.
=============================================================*/
export const getUsers = createReducer({}, {
    searchUsersRequest: (state, action) => {
        state.loading = true;
    },
    searchUsersSuccess: (state, action) => {
        state.loading = false;
        state.success = true;
        state.users = action.payload.users;
    },
    searchUsersFail: (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
    },
    clearError: (state) => {
        state.error = null;
    },
    clearMessage: (state) => {
        state.message = null;
    }
})
