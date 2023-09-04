const mongoose = require("mongoose");
/*
motivationalPostsSchema()
NAME
    motivationalPostsSchema - Schema for representing motivational posts.
SYNOPSIS
    const motivationalPostsSchema = new mongoose.Schema({ ... });
DESCRIPTION
    This schema defines the structure for representing motivational posts created by users.
    Motivational posts include the post creator's information, post content, timestamps, related challenge, comments, and likes.
FIELDS
    - creatorId: ObjectId (required)
        The ID of the user who created the motivational post.
    - title: String (required)
        The title of the motivational post.
    - content: String (required)
        The textual content of the motivational post.
    - allowUpdate: Boolean
        A flag indicating whether the post allows updates.
    - createdAt: Date
        The date and time when the motivational post was created.
    - challenge: ObjectId (ref: "Challenge")
        A reference to the related challenge, if any.
    - commentIds: [ObjectId] (required, ref: "Comment")
        An array of comment IDs associated with the post.
    - comments: [Object]
        An array of comment objects with fields:
        - postId: ObjectId (required)
            The ID of the post to which the comment belongs.
        - creatorId: ObjectId (ref: "User", required)
            The ID of the user who created the comment.
        - creatorName: String (required)
            The name of the comment creator.
        - creatorAvatar: String
            The avatar of the comment creator.
        - comment: String (required)
            The textual content of the comment.
        - commentedAt: Date
            The date and time when the comment was created.
        - edited: Boolean
            A flag indicating whether the comment has been edited.
    - likes: [ObjectId] (required)
        An array of user IDs who liked the motivational post.
INDEXES
    None.
*/

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
/*const motivationalPostsSchema = new mongoose.Schema({ ... }); */

module.exports = mongoose.model("Motivation", motivationalPosts);