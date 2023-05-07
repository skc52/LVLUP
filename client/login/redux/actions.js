import axios from "axios";

const serverUrl = `http://192.168.63.115:4000/api/v1`;
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


// logout 
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


// loaduser
export const loadUser  = () => async(dispatch) => {
    try {
        dispatch({type:"loadUserRequest"});
        const {data} = await axios.get(
            `${serverUrl}/me`, 
            {withCredentials:true}
           
        ) 

        dispatch({type:"loadUserSuccess", payload:data })
    } catch (error) {
        dispatch({type:"loadUserFail", payload:error.response.data.error })
    }
}

export const registerUser  = (email, password, name, avatar) => async(dispatch) => {
    try {
        console.log("HERE IN REGISTER USER ACTION")
        dispatch({type:"registerRequest"});
        const config = {headers:{"Content-type":"application/json"},  withCredentials: true};

        const lat = 32.22;
        const long = 32.22;
        const {data} = await axios.post(
            `${serverUrl}/register`, 
            {email, password, name, avatar, lat, long},
            config
        ) 

        dispatch({type:"registerSuccess", payload:data })

    } catch (error) {
        dispatch({type:"registerFail", payload:error.response.data.message})
    }
}


export const updateUser  = (name, avatar, avatarUpdateBool, base64Image) => async(dispatch) => {
    try {
        console.log("HERE IN Update USER ACTION")
        dispatch({type:"updateRequest"});
        const config = {headers:{"Content-type":"application/json"},  withCredentials: true};

        console.log(base64Image)
        const {data} = await axios.post(
            `${serverUrl}/me/update`, 
            {name, avatar, avatarUpdateBool, base64Image},
            config
        ) 

        console.log(data.user);
        dispatch({type:"updateSuccess", payload:data })

    } catch (error) {
        dispatch({type:"updateFail", payload:error.response.data.message})
    }
}


export const clearUpdate = () => async(dispatch) => {
    dispatch({type:"clearUpdate"})
}


// send activate otp

export const sendActivateOtp  = () => async(dispatch) => {
    try {
        
        dispatch({type:"sendActivateRequest"});
        const config = { withCredentials: true};

        const {data} = await axios.get(
            `${serverUrl}/me/sendactivateOTP`, 
           
            config
        ) 

        dispatch({type:"sendActivateSuccess", payload:data })
        
    } catch (error) {
        dispatch({type:"sendActivateFail", payload:error.response.data.message})
    }
}
// activate

export const activateAccount  = (activateOTP) => async(dispatch) => {
    try {
        
        dispatch({type:"activateRequest"});
        const config = {headers:{"Content-type":"application/json"},  withCredentials: true};

        const {data} = await axios.post(
            `${serverUrl}/me/activate`, 
            {activateOTP},
            config
        ) 

        dispatch({type:"activateSuccess", payload:data })
    } catch (error) {
        dispatch({type:"activateFail", payload:error.response.data.message})
    }
}



// changePw
export const changePw  = (prevpassword, newpassword) => async(dispatch) => {
    try {
        

        dispatch({type:"changePwRequest"});
        const config = {headers:{"Content-type":"application/json"},  withCredentials: true};
            console.log("here in change pw")

        
        const {data} = await axios.post(
            `${serverUrl}/changePassword`, 
            {prevpassword, newpassword},
            config
        ) 
        dispatch({type:"changePwSuccess", payload:data })
    } catch (error) {
        dispatch({type:"changePwFail", payload:error.response.data.message})
    }
}


// sendresetemail
export const sendResetEmail  = (email) => async(dispatch) => {
    try {
        
        dispatch({type:"sendResetRequest"});
        const config = {headers:{"Content-type":"application/json"}};

        
        const {data} = await axios.post(
            `${serverUrl}/sendResetPasswordOTP`, 
            {email},
            config
        ) 

        console.log("here in send reset success")

        dispatch({type:"sendResetSuccess", payload:data })
    } catch (error) {
        dispatch({type:"sendResetFail", payload:error.response.data.message})
    }
}


// reset password
export const resetPw  = (email, resetPasswordOTP , newpassword ) => async(dispatch) => {
    try {
        console.log("reset pw ")

        dispatch({type:"resetPwRequest"});
        const config = {headers:{"Content-type":"application/json"}};
       
        const {data} = await axios.post(
            `${serverUrl}/resetPassword`, 
            {email, resetPasswordOTP, newpassword},
            config
        ) 
        console.log("reset pw success")

        dispatch({type:"resetPwSuccess", payload:data })
    } catch (error) {
        dispatch({type:"resetPwFail", payload:error.response.data.message})
    }
}


export const clearReset = () => async(dispatch)=>{
   
        dispatch({type:"clearReset"});
        
}

// send follow request
export const sendFollowRequest  = (id ) => async(dispatch) => {
    try {
        console.log("Sent rque")
        
        dispatch({type:"sendFollowRequest"});
        const config = { withCredentials: true};

       
        const {data} = await axios.put(
            `${serverUrl}/connect/request/send/${id}`, 
            config
        ) 

        dispatch({type:"sendFollowSuccess", payload:data })
    } catch (error) {
        dispatch({type:"sendFollowFail", payload:error.response.data.message})
    }
}

export const clearSendSuccess  = ( ) => async(dispatch) => {
    dispatch({type:"clearSendSuccess"});

}



// accept follow
export const acceptFollowRequest  = (id ) => async(dispatch) => {
    try {
        
        console.log("here in accept follow action")

        dispatch({type:"acceptFollowRequest"});
        const config = { withCredentials: true};

       
        const {data} = await axios.put(
            `${serverUrl}/connect/request/accept/${id}`, 
            config
        ) 

        console.log("acecepet")

        dispatch({type:"acceptFollowSuccess", payload:data })
    } catch (error) {
        dispatch({type:"acceptFollowFail", payload:error.response.data.message})
    }
}

export const clearAcceptSuccess  = ( ) => async(dispatch) => {
    dispatch({type:"clearAcceptSuccess"});

}




// unfollow
export const unFollow  = (id ) => async(dispatch) => {
    try {
        
        dispatch({type:"unFollowRequest"});
        const config = { withCredentials: true};

       
        const {data} = await axios.put(
            `${serverUrl}/connect/unfollow/${id}`, 
            config
        ) 

        dispatch({type:"unFollowSuccess", payload:data })
    } catch (error) {
        dispatch({type:"unFollowFail", payload:error.response.data.message})
    }
}

export const clearUnfollowSuccess  = ( ) => async(dispatch) => {
    dispatch({type:"clearUnfollowSuccess"});

}

// remove following
export const removeFollowing  = (id ) => async(dispatch) => {
    try {
        
        dispatch({type:"removeFollowRequest"});
        const config = { withCredentials: true};

       
        const {data} = await axios.put(
            `${serverUrl}/connect/removeFollowing/${id}`, 
            config
        ) 

        dispatch({type:"removeFollowSuccess", payload:data })
    } catch (error) {
        dispatch({type:"removeFollowFail", payload:error.response.data.message})
    }
}

export const getAllUsersSearch = (name) => async(dispatch)=>{
    try {
        dispatch({type:"searchUsersRequest"});
        const config = {headers:{"Content-type":"application/json"},  withCredentials: true};
 
        const {data} = await axios.post(
            `${serverUrl}/users/search`, 
            {
                name
            },
            config
        ) 
        dispatch({type:"searchUsersSuccess", payload:data});

        
    } catch (error) {
        dispatch({type:"searchUsersFail", payload:error.response.data.message})
    }
}

export const getAllFollowRequests = () => async(dispatch)=>{
    try {
        dispatch({type:"searchUsersRequest"});
        const config = {headers:{"Content-type":"application/json"},  withCredentials: true};
 
        const {data} = await axios.get(
            `${serverUrl}/me/followRequests`, 
           
            config
        ) 
        console.log(data?.users);
        dispatch({type:"searchUsersSuccess", payload:data});

        
    } catch (error) {
        dispatch({type:"searchUsersFail", payload:error.response.data.message})
    }
}



export const getAUser  = (id) => async(dispatch) => {
    try {
        console.log("Here in ")
        dispatch({type:"getAUserRequest"});
        const {data} = await axios.get(
            `${serverUrl}/user/${id}`,
            
            {withCredentials:true}
           
        ) 
        console.log(data)

        dispatch({type:"getAUserSuccess", payload:data })
    } catch (error) {
        dispatch({type:"getAUserFail", payload:error.response.data.error })
    }
}




export const getNoMessageUsers  = () => async(dispatch) => {
    try {
        dispatch({type:"searchUsersRequest"});
        const config = {  withCredentials: true};
 
        const {data} = await axios.get(
            `${serverUrl}/messages/no`, 
           
            config
        ) 
        dispatch({type:"searchUsersSuccess", payload:data});

        
    } catch (error) {
        dispatch({type:"searchUsersFail", payload:error.response.data.message})
    }
}


