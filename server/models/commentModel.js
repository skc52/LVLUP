const mongoose = require("mongoose");
/*
commentSchema()
NAME
    commentSchema - Schema for representing comments on posts.
SYNOPSIS
    const commentSchema = new mongoose.Schema({ ... });
DESCRIPTION
    This schema defines the structure for representing comments on posts in a MongoDB database.
    Comments are user-generated content and are used to add textual feedback or discussions to posts.
FIELDS
    - postId: ObjectId (required)
        The ID of the post to which the comment is associated.
    - creatorId: ObjectId (required)
        The ID of the user who created the comment.
    - comment: String (required)
        The textual content of the comment.
    - commentedAt: Date
        The date and time when the comment was created.
    - edited: Boolean
        Indicates whether the comment has been edited.
INDEXES
    None.
*/
const commentSchema = new mongoose.Schema({
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
    },
    
})
/*const commentSchema = new mongoose.Schema({ ... }); */


module.exports = mongoose.model("Comment", commentSchema);