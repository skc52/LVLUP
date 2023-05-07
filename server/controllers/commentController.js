const Post = require("../models/postModel.js");
const User = require("../models/userModel.js");
const Comment = require("../models/commentModel.js");
const ErrorHandler = require("../utils/errorHandler.js");


exports.addNewComment = async(req, res, next) => {
    try {
        console.log("adding a comment")
        const post = await Post.findById(req.params.postId);
        if(!post){
            return next(new ErrorHandler(`Post not found`));    
        }
        const commenter = await User.findById(req.user.id);
        if(!commenter){
            return next(new ErrorHandler(`User not found`));    
        }
        const {comment} = req.body;

        const newComment = await Comment.create({
            postId:post.id,
            creatorId:commenter.id,
            comment,

        })

        post.commentIds.push(newComment._id);
        await post.save()

        res.status(200).json({
            success:true,
            newComment,
            message:"Comment posted"
        })
    } catch (error) {
        next(error);
    }
}

exports.addReplies = async(req, res, next) => {
    try {
        const commenter = await User.findById(req.user.id);
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(new ErrorHandler(`Comment not found`));    
        }
        const {newReply} = req.body;
        comment.replies.push({
            reply:newReply,
            creatorId:commenter.id,
        })

        await comment.save();

        res.status(200).json({
            success:true,
            comment,
            message:"Reply added to the thread"
        })
    } catch (error) {
        next(error)
    }
}


exports.showCommentsForAProject = async(req, res, next) => {
    try {
        //get the project id
        const comments = await Comment.find({postId:req.params.postId}).populate("creatorId");
        res.status(200).json({
            success:true,
            comments
        })
    } catch (error) {
        next(error);
    }
}

exports.showAllComments = async(req, res, next) => {
    try {
        //get the project id
        const comments = await Comment.find().populate("creatorId");
        res.status(200).json({
            success:true,
            comments
        })
    } catch (error) {
        next(error);
    }
}



//delete an entire comment
exports.deleteComment = async(req, res, next) => {
    try {
        //get the commentId
        const comment = await Comment.findById(req.params.commentId);
        if (comment.creatorId.toString() !== req.user.id){
            return next(new ErrorHandler(`User not authorized to delete this comment`));
        }
        if (!comment){
            return next(new ErrorHandler(`Comment does not exist with id: ${req.params.commentId}`));

        }

        await comment.remove();

        res.status(200).json({
            success:true,
            message:"Comment deleted successfully"
        })
    } catch (error) {
        next(error);
    }
}

//delete a reply
exports.deleteReply = async(req, res, next) => {
    try {
        
        const replyID = req.params.replyId;
        const comment = await Comment.findById(req.params.commentId);
        if (!comment){
            return next(new ErrorHandler(`Comment does not exist with id: ${req.params.commentId}`));
        }  
        //not working
        let doesReplyExist = false;
        comment.replies = comment.replies.filter((reply, ind)=>{
            if (reply.id.toString() === replyID){
                doesReplyExist = true;
                if(reply.creatorId.toString() !== req.user.id){
                    return next(new ErrorHandler(`User not authorized to delete this reply`));
                }
                return false
            }
            return true
        })

        //check if the reply actually existed if it did not then we have to send an error
        if (!doesReplyExist){
            return next(new ErrorHandler(`Reply with the id ${replyID} does not exist`));
        }
        await comment.save();
        res.status(200).json({
            success:true,
            comment
        })

    } catch (error) {
        next(error)
    }
}
 
//edit a comment
exports.editComment = async(req, res, next) => {
    try {

        let comment = await Comment.findById(req.params.commentId);
        if (!comment){
            return next(new ErrorHandler(`Comment does not exist with id: ${req.params.commentId}`)); 
        }

        if (req.user.id !== comment.creatorId.toString()){
            return next(new ErrorHandler(`User not authorized to edit this comment`))
        }
        const {editedComment} = req.body;
        const updatedComment = {
            comment:editedComment,
            edited:true
        }
        

        comment = await Comment.findByIdAndUpdate(req.params.commentId, updatedComment, {
            new:true,
            runValidators:true,
            useFindAndModify:false,
        })
       
        res.status(200).json({
            success:true,
            comment
        });

    } catch (error) {
        next(error);
    }
}

//edit a reply
exports.editReply = async(req, res, next) => {
    try {
        //i need the commentId and the replyId for the reply
        const comment = await Comment.findById(req.params.commentId);
        if (!comment){
            return next(new ErrorHandler(`Comment does not exist with id: ${req.params.commentId}`)); 
        }
        const {editedReply} = req.body;
       
        comment.replies.map((reply, ind)=>{
            if (reply.id.toString()=== req.params.replyId){
                if (reply.creatorId.toString()!== req.user.id){
                    return next(new ErrorHandler(`User is not authorized to edit this reply`));       
                }
                reply.reply = editedReply;
                reply.edited = true;
                
            }
            return reply;
           
        })
        await comment.save();
        res.status(200).json({
            success:true,
            comment
        });

    } catch (error) {
        next(error);
    }
}