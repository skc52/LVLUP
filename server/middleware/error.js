const ErrorHandler = require("../utils/errorHandler");

/*
errorHandler(err, req, res, next)
NAME
    errorHandler - Custom error handling middleware.
SYNOPSIS
    errorHandler = (err, req, res, next);
    err -> The error object containing information about the error.
    req -> Request object.
    res -> Response object for sending error responses.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This custom error handling middleware is used to handle various types of errors and send appropriate error responses. It sets the status code and error message based on the type of error encountered. The handled error types include MongoDB ID casting error, MongoDB duplicate key error, JSON Web Token (JWT) validation error, and JWT token expiration error. It then sends a JSON response with the error status code and message to the client.
RETURNS
    No direct return value. Sends an error response to the client.
*/

/*
errorHandler(err, req, res, next)
- Custom error handling middleware to handle and send error responses.
- Handles various types of errors, including MongoDB ID casting error, MongoDB duplicate key error, JSON Web Token (JWT) validation error, and JWT token expiration error.
- Sends a JSON response with the appropriate error status code and message to the client.
*/


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

   
    //wrong MongoDB ID error
    if (err.name ==="CastError"){
        const message = `Resource not found. Invalid:${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongo duplicate key error
    if(err.code === 11000){
      
        const message = `Duplicate ${Object.keys(err.keyValue)} entered` ;
        err = new ErrorHandler(message, err.statusCode);
    }

    //Wrong JWT error
    if(err.name === "JsonWebTokenError") {
        const message = `JSON web token is invalid, Try Again`;
        err = new ErrorHandler(message, err.statusCode);
    }

    //JWT expired error
    if(err.name === "TokenExpiredError") {
        const message = "JSON web token is expired, Try Again";
        err = new ErrorHandler(message, err.statusCode);
    }


    res.status(err.statusCode).json({
        success:false,
        error:err.message,
    })
}
/* errorHandler = (err, req, res, next); */

/*
    the job of the error middleware is to customize some error properties and
    send the json response
    this is why we donot send any json response in catch part
    because whenever the program encounters an error this middleware comes into play
*/