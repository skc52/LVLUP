const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


/*
isAuthenticatedUser(req, res, next)
NAME
    isAuthenticatedUser - Middleware for checking if a user is authenticated.
SYNOPSIS
    isAuthenticatedUser = async (req, res, next);
    req -> Request object containing user information.
    res -> Response object for sending responses.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This middleware is used to check if a user is authenticated. It verifies the user's token from cookies and retrieves user information from the token. If the user is authenticated, it stores the user information in the req.user object and passes control to the next middleware function. If the user is not authenticated (no token provided), it returns an error response with status code 402.
RETURNS
    No direct return value. It stores user information in the req.user object or sends an error response if not authenticated.

a
*/


exports.isAuthenticatedUser = async (req, res, next) => {
    const {token} = req.cookies;
    if (!token){
        return next(new ErrorHandler("Not logged in", 402));
    }
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    // store the logged in user in req.user
    req.user = await User.findById(decodedUser.id);
    
    next();
}
/* isAuthenticatedUser = async (req, res, next); */




/*
authorizedRoles(...roles)
NAME
    authorizedRoles - Middleware for checking if a user has the required roles.
SYNOPSIS
    authorizedRoles = (...roles) => (req, res, next);
    roles -> Array of roles that are authorized to access a resource.
    req -> Request object containing user information.
    res -> Response object for sending responses.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This middleware is used to check if a user has the required roles to access a specific resource. It takes an array of roles as arguments and checks if the user's role is included in the array. If the user has an authorized role, it allows access to the resource by passing control to the next middleware function. If the user's role is not authorized, it returns an error response with status code 403, indicating forbidden access.
RETURNS
    No direct return value. It either allows access to the resource or sends an error response if the user's role is not authorized.
*/
exports.authorizedRoles = (...roles) =>{  
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
           
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        };
        next();
    }   
}
/*authorizedRoles = (...roles) => (req, res, next); */