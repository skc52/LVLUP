const mongoose = require("mongoose");
const motivationalPosts = new mongoose.Schema({
    creatorId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        required:[true, "Please Enter Title for the post"],
        trim:true,
    },
    content:{
        type:String,
        required:[true, "Please Enter post content"],
    },
    
    allowUpdate:{
        type:Boolean
    },
    
      
    createdAt:{
        type:Date,
        default:Date.now,
    },

    challenge:{
        type:mongoose.Schema.ObjectId,
        ref:"Challenge"

    },

    commentIds:[
        {
            type:mongoose.Schema.ObjectId,
            required:true,
            ref:"Comment"
        }
    ],

    comments:[
        {
        postId:{
            type:mongoose.Schema.ObjectId,
            required:true
        },
        creatorId:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        }
        ,
        creatorName:{
            type:String,
            required:true,
        },
        creatorAvatar:{
            type: String,
        },
        comment:{
            type:String,
            required:true,
        },
        commentedAt:{
            type:Date,
            default:Date.now(),
        },
        edited:{
            type:Boolean,
            default:false
        }}
    ],
   
    
    likes:[
        {
            type:mongoose.Schema.ObjectId,
            required:true,
        }
    ]
    
})


module.exports = mongoose.model("Motivation", motivationalPosts);