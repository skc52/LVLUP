const mongoose = require("mongoose");
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

challengeSchema.index({ title: 'text', challenge:'text'});

module.exports = mongoose.model("Challenge", challengeSchema);