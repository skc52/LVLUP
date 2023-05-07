const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


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


//hashing the password before saving the user
//we cannot use this inside arrow function
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

//compare password 
userSchema.methods.comparePassword = async function(password){
    return await bcryptjs.compare(password, this.password);
}

//JWT token
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


//we will generate an OTP and set it as the resetPasswordOTP
userSchema.methods.getResetPasswordOTP = function(){
    
    //generate a random number between 100000 and 999999 inclusive
    this.resetPasswordOTP = Math.floor(100000 + Math.random() * 900000);
    //Date.now() returns the number of milliseconds elapsed since Jan 1, 1970 midnight
    //we want the expiry to be in 15 minutes which is equivalent to 15*60*1000 milliseconds
    this.resetPasswordExpire = Date.now() + 15*60*1000;
    return this.resetPasswordOTP;
}

//we will generate an OTP and set it as the activateOTP
userSchema.methods.getActivateOTP = function(){


    //generate a random number between 100000 and 999999 inclusive
    this.activateOTP = Math.floor(100000 + Math.random() * 900000);
    //Date.now() returns the number of milliseconds elapsed since Jan 1, 1970 midnight
    //we want the expiry to be in 15 minutes which is equivalent to 15*60*1000 milliseconds
    this.activateExpire = Date.now() + 15*60*1000;

    return this.activateOTP;
}

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
  

module.exports = mongoose.model("User", userSchema);