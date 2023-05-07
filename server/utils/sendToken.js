//Create a token and save it in cookie

const sendToken = (user, statusCode, res)=>{
    const token  = user.getJWTToken();

    //options for cookie
    const options = {
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRY *24*60*60*1000//converting into miliseconds
        ),
        httpOnly:true,
        secure:false,//for development phase

    }
    res.cookie('token', token, options);
    res.status(statusCode).json({
        success:true,
        user,
        token,
        message:"Successful"
    })
}

module.exports = sendToken;