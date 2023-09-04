const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/*
userSchema()
NAME
    userSchema - Schema for representing user data.
SYNOPSIS
    const userSchema = new mongoose.Schema({ ... });
DESCRIPTION
    This schema defines the structure for representing user data in the application.
    It includes fields for user details such as name, email, password, avatar, role, location, and various user-related data.
    The schema also includes methods for password hashing, OTP generation, JWT token generation, challenge completion, and challenge failure.
FIELDS
    - name: String (required)
        The name of the user.
    - email: String (required, unique)
        The email address of the user.
    - password: String (required)
        The hashed password of the user.
    - avatar: Object
        An object containing the avatar's public_id and URL.
    - createdAt: Date
        The date and time when the user account was created.
    - role: String
        The role of the user (e.g., "user").
    - location: Object
        An object representing the user's location with coordinates.
    - resetPasswordOTP: Number
        OTP (One-Time Password) for resetting the user's password.
    - resetPasswordExpire: Number
        Timestamp for the expiration of the reset password OTP.
    - activateOTP: Number
        OTP for account activation.
    - activateExpire: Number
        Timestamp for the expiration of the account activation OTP.
    - isActivated: Boolean
        A flag indicating whether the user's account is activated.
    - followers: [ObjectId]
        An array of user IDs who follow the current user.
    - following: [ObjectId]
        An array of user IDs whom the current user follows.
    - followRequests: [ObjectId] (ref: "User")
        An array of user IDs for follow requests sent to the current user.
    - completedChallenges: [ObjectId] (ref: "Challenge")
        An array of challenge IDs completed by the user.
    - onGoingChallenges: [ObjectId] (ref: "Challenge")
        An array of challenge IDs in progress by the user.
    - failedChallenges: [ObjectId] (ref: "Challenge")
        An array of challenge IDs failed by the user.
    - level: Number
        The user's level or experience.
METHODS
    - pre("save", async function(next))
        Middleware function for hashing the user's password before saving.
    - comparePassword(password)
        Method to compare a provided password with the user's hashed password.
    - getJWTToken()
        Method to generate a JWT (JSON Web Token) for the user.
    - getResetPasswordOTP()
        Method to generate a reset password OTP and set its expiration.
    - getActivateOTP()
        Method to generate an activation OTP and set its expiration.
    - completeChallenge(challengeId)
        Method to mark a challenge as completed and update the user's level.
    - markChallengeAsFailed(challengeId)
        Method to mark a challenge as failed and update the user's ongoing and failed challenges.
INDEXES
    None.
*/



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter your name"], 
    },
    email:{
        type:String,
        required:[true, "Please enter your Email"],
        unique:true,
        validate:[validator.isEmail, "Please enter valid Email"],
    },
    password:{
        type:String,
        required:[true, "Please enter your password"],
        minLength:[8, "Password should have at least 8 characters"],
        select:false,//this will prevent password from being shown when querying
    },
    avatar: {
        public_id: String,
        url: String,
      },
    createdAt:{
        type:Date,
        default:Date.now,
    },   
    role:{
        type:String,
        default:"user",
    },
    location :  {
        type: {
            type: String,
            enum:['Point'],
            default:"Point"
          },
          coordinates: {
            type: [Number], //the type is an array of numbers
            required:true
          }
    },
    resetPasswordOTP:{
        type:Number,
        select:false,

    },
    resetPasswordExpire:Number,
    activateOTP:{
        type:Number,
        select:false,

    },
    activateExpire:Number,
    isActivated:{
        type:Boolean,
        default:false,
    },

    followers:[
        {
            type:mongoose.Schema.ObjectId,
        }
    ],
    following:[
        {
            type:mongoose.Schema.ObjectId,
        }
    ],
    followRequests:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"User"
        }
    ],

    completedChallenges:[
        {
            type:mongoose.Schema.ObjectId,
            required:true,
            ref:"Challenge"

        }

    ],

    onGoingChallenges:[
        {
            type:mongoose.Schema.ObjectId,
            required:true,
            ref:"Challenge"
        }
    ],
    failedChallenges:[
        {
            type:mongoose.Schema.ObjectId,
            required:true,
            ref:"Challenge"

        }
    ],
    level:{
        type:Number,
        default:0,
        required:true,
    },
    
        
    
    

})
/*const userSchema = new mongoose.Schema({ ... }); */


/*
hashPasswordBeforeSave()
NAME
    hashPasswordBeforeSave - Middleware to hash the user's password before saving to the database.
SYNOPSIS
    userSchema.pre("save", async function(next);
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This middleware function is used to hash the user's password before saving it to the database. It is executed before saving the user model to the database. It checks if the password has been modified (either during user creation or password update), and if so, it hashes the password using bcryptjs with a salt factor of 10.
RETURNS
    No direct return value. It modifies the user's password in the user model.
*/

userSchema.pre("save", async function(next){
    //there will many instances of saving the user
    //but we only want to hash the password when we are
    // either creating the user or changing password
    if (this.isModified("password")){
        this.password = await bcryptjs.hash(this.password, 10);
    }
    //after we are done modifying the password or not, 
    //we can move on to the next operations
    next();
})
/*userSchema.pre("save", async function(next);*/

/*
comparePassword()
NAME
    comparePassword - Compares a provided password with the user's stored hashed password.
SYNOPSIS
    userSchema.methods.comparePassword(password);
    password -> The password to be compared with the user's stored hashed password.
DESCRIPTION
    This method is used to compare a provided password with the hashed password stored in the user's model. It uses the bcryptjs library to securely compare the two passwords by hashing the provided password and comparing it to the stored hashed password.
RETURNS
    Returns a Promise that resolves to a boolean value:
    - `true` if the provided password matches the stored hashed password.
    - `false` if the provided password does not match the stored hashed password.
*/

userSchema.methods.comparePassword = async function(password){
    return await bcryptjs.compare(password, this.password);
}
/*  userSchema.methods.comparePassword(password); */

/*
getJWTToken()
NAME
    getJWTToken - Generates a JSON Web Token (JWT) for the user.
SYNOPSIS
    userSchema.methods.getJWTToken();
DESCRIPTION
    This method generates a JSON Web Token (JWT) for the user using the user's unique identifier (ID) and a secret key defined in the environment variables. The JWT is typically used for user authentication and authorization.
RETURNS
    Returns a JWT string that can be used for user authentication and authorization purposes.
*/

userSchema.methods.getJWTToken = function(){
    return jwt.sign(
    {
        id:this._id
    }
    ,
    process.env.JWT_SECRET,
    {
        expiresIn:process.env.JWT_EXPIRY,
    }
    )
}
/*userSchema.methods.getJWTToken();*/


/*
getResetPasswordOTP()
NAME
    getResetPasswordOTP - Generates a one-time password (OTP) for resetting the user's password.
SYNOPSIS
    userSchema.methods.getResetPasswordOTP();
DESCRIPTION
    This method generates a random one-time password (OTP) for the purpose of resetting the user's password. The OTP is a six-digit number, and it is stored in the user's document along with its expiration time. The OTP is typically sent to the user's email address for verification.
RETURNS
    Returns the generated one-time password (OTP).
*/

userSchema.methods.getResetPasswordOTP = function(){
    
    //generate a random number between 100000 and 999999 inclusive
    this.resetPasswordOTP = Math.floor(100000 + Math.random() * 900000);
    //Date.now() returns the number of milliseconds elapsed since Jan 1, 1970 midnight
    //we want the expiry to be in 15 minutes which is equivalent to 15*60*1000 milliseconds
    this.resetPasswordExpire = Date.now() + 15*60*1000;
    return this.resetPasswordOTP;
}
/* userSchema.methods.getResetPasswordOTP(); */

/*
getActivateOTP()
NAME
    getActivateOTP - Generates a one-time password (OTP) for user account activation.
SYNOPSIS
    userSchema.methods.getActivateOTP();
DESCRIPTION
    This method generates a random one-time password (OTP) for user account activation. The OTP is a six-digit number, and it is stored in the user's document along with its expiration time. The OTP is typically sent to the user's email address for verification during the account activation process.
RETURNS
    Returns the generated one-time password (OTP).
*/

userSchema.methods.getActivateOTP = function(){


    //generate a random number between 100000 and 999999 inclusive
    this.activateOTP = Math.floor(100000 + Math.random() * 900000);
    //Date.now() returns the number of milliseconds elapsed since Jan 1, 1970 midnight
    //we want the expiry to be in 15 minutes which is equivalent to 15*60*1000 milliseconds
    this.activateExpire = Date.now() + 15*60*1000;

    return this.activateOTP;
}
/* userSchema.methods.getActivateOTP(); */


/*
completeChallenge(challengeId)
NAME
    completeChallenge - Marks a challenge as completed by a user and updates the user's progress.
SYNOPSIS
    userSchema.methods.completeChallenge(challengeId);
    challengeId -> The unique identifier of the challenge to be marked as completed.
DESCRIPTION
    This method is used to mark a specific challenge as completed by a user. It performs the following steps:
    1. Removes the specified challenge from the user's ongoing challenges array.
    2. Adds the challenge to the user's completed challenges array.
    3. Increments the user's level as a reward for completing the challenge.
    4. Saves the updated user object in the database.

    This method is typically called when a user successfully completes a challenge and achieves a milestone.
RETURNS
    Returns the updated user object with the completed challenge marked as such and the user's level incremented.
*/


userSchema.methods.completeChallenge = async function(challengeId) {
    // Remove the challenge from the ongoing challenges array
    this.onGoingChallenges = this.onGoingChallenges.filter(id => id.toString() !== challengeId.toString());
  
    // Add the challenge to the completed challenges array
    this.completedChallenges.push(challengeId);
  
    // Increment the user's level
    this.level += 1;
  
    // Return the updated user object
    return await this.save();
  }
/*userSchema.methods.completeChallenge(challengeId); */



/*
markChallengeAsFailed(challengeId)
NAME
    markChallengeAsFailed - Marks a challenge as failed by a user and updates the user's progress.
SYNOPSIS
    userSchema.methods.markChallengeAsFailed(challengeId);
    challengeId -> The unique identifier of the challenge to be marked as failed.
DESCRIPTION
    This method is used to mark a specific challenge as failed by a user. It performs the following steps:
    1. Checks if the specified challenge is in the user's ongoing challenges array.
    2. If the challenge is found, it removes the challenge from the user's ongoing challenges array.
    3. Adds the challenge to the user's failed challenges array to keep a record.
    4. Saves the updated user object in the database.

    This method is typically called when a user fails to complete a challenge within the specified duration.
RETURNS
    Returns true if the challenge was successfully marked as failed and the user's progress updated. Returns false if the challenge was not found in the ongoing challenges array.
*/

  userSchema.methods.markChallengeAsFailed = async function(challengeId) {
    try {
      const challengeIndex = this.onGoingChallenges.indexOf(challengeId);
      if (challengeIndex !== -1) {
        // Remove challenge from onGoingChallenges array
        this.onGoingChallenges.splice(challengeIndex, 1);
        // Add challenge to failedChallenges array
        this.failedChallenges.push(challengeId);
        await this.save();
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }
/*userSchema.methods.markChallengeAsFailed(challengeId); */
  

module.exports = mongoose.model("User", userSchema);