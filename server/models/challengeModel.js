const mongoose = require("mongoose");
/*
challengeSchema()
NAME
    challengeSchema - Schema for representing challenges.
SYNOPSIS
    const challengeSchema = new mongoose.Schema({ ... });
DESCRIPTION
    This schema defines the structure for representing challenges in a MongoDB database.
    Challenges are user-generated content and are used to create, track, and manage various challenges.
FIELDS
    - creatorId: ObjectId
        The ID of the user who created the challenge.
    - title: String (required)
        The title of the challenge.
    - challenge: String (required)
        The content or description of the challenge.
    - duration: Number (required)
        The duration of the challenge, typically measured in some unit of time.
    - images: Array of objects
        An array of image objects, each containing a public_id and a URL.
    - tags: Array of Strings (required)
        An array of tags associated with the challenge.
    - checkedIn: Array of objects
        An array of objects representing users who have checked in for the challenge. Each object contains:
        - userId: ObjectId (required)
            The ID of the user who checked in.
        - streak: Number
            The streak count for the user's participation in the challenge.
        - checkedIn: Boolean
            Indicates whether the user has checked in.
        - latestReport: String (required)
            The latest report or message from the user.
        - lastReported: Date
            The date when the user last reported.
    - joinedUsers: Array of objects
        An array of objects representing users who have joined the challenge. Each object contains:
        - userId: ObjectId (required)
            The ID of the user who joined.
        - quit: Boolean
            Indicates whether the user has quit the challenge.
        - completed: Boolean
            Indicates whether the user has completed the challenge.
        - rating: Number
            The rating given by the user for the challenge.
    - createdAt: Date
        The date when the challenge was created.
    - upvotes: Array of ObjectIds (required)
        An array of ObjectIds representing users who upvoted the challenge.
    - public: Boolean
        Indicates whether the challenge is public or not.
INDEXES
    - Text indexes on the 'title' and 'challenge' fields for searchability.
*/
const challengeSchema = new mongoose.Schema({
    creatorId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    title:{
        type:String,
        required:[true, "Please Enter Title for the challenge"],
        trim:true,
    },
    challenge:{
        type:String,
        required:[true, "Please Enter post content"],
    }, 
    duration:{
        type:Number,
        required:[true, "Please Enter the duration for the challenge"]
    },
    images:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            },
        }
    ],
    tags:[
        {
        type:String,
        required:[true, "Please enter tags"],
        }
    ],  
    checkedIn:[
        {
            userId:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },
            
            streak:{
                type:Number,
                required:true,
                default:0,
                min:0,
                max:this.duration
            },
            checkedIn:{
                type:Boolean,
                default:false
            }
            ,
            latestReport:{
                type:String,
                required:[true, "Please enter your message"]
            }
            ,
            lastReported:{
                type:Date,
                required:true,
                default:Date.now()
            }
        }
    ]
    ,
    joinedUsers:[
        {
            userId:{
                type:mongoose.Schema.ObjectId,
                required:true,
            }
            
            ,
            quit:{
                type:Boolean,
                default:false,
                required:true
            },
            completed:{
                type:Boolean,
                default:false,
                required:true
            },
            rating:{
                type:Number,
            }
        }
    ],
    // completed user - streak == duration
    // joined users - userId from streaks
    createdAt:{
        type:Date,
        default:Date.now,
    },
    // this will set the difficulty level
    // based on the upvote, the level incr for the user will be determined
    upvotes:[
        {
            type:mongoose.Schema.ObjectId,
            required:true,
        }
    ],
    public:{
        type:Boolean,
        default:false,
        required:true
    }
})
/*const challengeSchema = new mongoose.Schema({ ... }); */

challengeSchema.index({ title: 'text', challenge:'text'});

module.exports = mongoose.model("Challenge", challengeSchema);