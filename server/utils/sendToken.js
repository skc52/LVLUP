

/*
sendToken(user, statusCode, res)
NAME
    sendToken - Create a token and save it in a cookie.
SYNOPSIS
    sendToken = (user, statusCode, res);
    user -> The user object for whom the token is being generated.
    statusCode -> The HTTP status code to be sent in the response.
    res -> The response object to which the token and response data will be sent.
DESCRIPTION
    This function generates a JSON Web Token (JWT) for the provided user object using the user's ID. It then sets the JWT as a cookie in the response with options for expiration, HTTP-only, and security. Finally, it sends a JSON response containing the user object, the token, and a success message with the specified HTTP status code.
RETURNS
    No direct return value. Sets a cookie and sends a JSON response with the user, token, and message.
*/

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
/* sendToken = (user, statusCode, res); */
module.exports = sendToken;