const Post = require("../models/postModel.js");
const User = require("../models/userModel.js");
const Comment = require("../models/commentModel.js");
const ErrorHandler = require("../utils/errorHandler.js");


/**/
/*
addNewComment()
NAME
    addNewComment - Adds a new comment to a post.
SYNOPSIS
    addNewComment = async (req, res, next) => {...};
    req -> Request object containing the post ID, user ID, and the comment text.
    res -> Response object that carries the new comment information and a success status.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to add a new comment to a post. It retrieves the post and commenter by their IDs,
    creates a new comment, and associates it with the post. It then responds with the newly created comment's details.
RETURNS
    None.
*/
/**/
exports.addNewComment = async (req, res, next) => {
    try {
        console.log("adding a comment");
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(new ErrorHandler(`Post not found`));
        }
        const commenter = await User.findById(req.user.id);
        if (!commenter) {
            return next(new ErrorHandler(`User not found`));
        }
        const { comment } = req.body;

        const newComment = await Comment.create({
            postId: post.id,
            creatorId: commenter.id,
            comment,
        });

        post.commentIds.push(newComment._id);
        await post.save();

        res.status(200).json({
            success: true,
            newComment,
            message: "Comment posted",
        });
    } catch (error) {
        next(error);
    }
};
/* addNewComment = async (req, res, next) => {...}; */

/**/
/*
addReplies()
NAME
    addReplies - Adds a reply to a comment thread.
SYNOPSIS
    addReplies = async (req, res, next) => {...};
    req -> Request object containing the comment ID and the new reply.
    res -> Response object that carries the updated comment with the new reply and a success status.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function adds a new reply to an existing comment thread. It retrieves the comment by the provided comment ID,
    appends the new reply to the comment's replies array, and saves the updated comment.
    It then responds with the updated comment and a success status.
RETURNS
    None.
*/
/**/
exports.addReplies = async (req, res, next) => {
    try {
        const commenter = await User.findById(req.user.id);
        const comment = await Comment.findById(req.params.commentId);

        // Check if the comment exists
        if (!comment) {
            return next(new ErrorHandler(`Comment not found`));
        }

        const { newReply } = req.body;

        // Add the new reply to the comment's replies array
        comment.replies.push({
            reply: newReply,
            creatorId: commenter.id,
        });

        // Save the updated comment
        await comment.save();

        res.status(200).json({
            success: true,
            comment,
            message: "Reply added to the thread",
        });
    } catch (error) {
        next(error);
    }
};
/* addReplies = async (req, res, next) => {...}; */



/**/
/*
showCommentsForAProject()
NAME
    showCommentsForAProject - Retrieves comments for a project (post).
SYNOPSIS
    showCommentsForAProject = async (req, res, next) => {...};
    req -> Request object containing the project (post) ID.
    res -> Response object that carries the comments associated with the project and a success status.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves comments associated with a project (post) identified by the provided project ID.
    It then responds with the retrieved comments and a success status.
RETURNS
    None.
*/
/**/
exports.showCommentsForAProject = async (req, res, next) => {
    try {
        // Get the project (post) ID from the request parameters
        const comments = await Comment.find({ postId: req.params.postId }).populate("creatorId");

        res.status(200).json({
            success: true,
            comments,
        });
    } catch (error) {
        next(error);
    }
};
/* showCommentsForAProject = async (req, res, next) => {...}; */


/**/
/*
showAllComments()
NAME
    showAllComments - Retrieves all comments.
SYNOPSIS
    showAllComments = async (req, res, next) => {...};
    req -> Request object.
    res -> Response object that carries all comments and a success status.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves all comments in the system, including their creators.
    It then responds with the retrieved comments and a success status.
RETURNS
    None.
*/
/**/
exports.showAllComments = async (req, res, next) => {
    try {
        // Get all comments and populate the creator information
        const comments = await Comment.find().populate("creatorId");

        res.status(200).json({
            success: true,
            comments,
        });
    } catch (error) {
        next(error);
    }
};
/* showAllComments = async (req, res, next) => {...}; */



/**/
/*
deleteComment()
NAME
    deleteComment - Deletes an entire comment.
SYNOPSIS
    deleteComment = async (req, res, next) => {...};
    req -> Request object containing the comment ID.
    res -> Response object that carries a success status and a deletion message.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function deletes an entire comment based on the provided comment ID. 
    It checks if the requesting user is authorized to delete the comment.
    If successful, it responds with a success status and a deletion message.
RETURNS
    None.
*/
/**/
exports.deleteComment = async (req, res, next) => {
    try {
        // Get the comment ID
        const comment = await Comment.findById(req.params.commentId);

        // Check if the requesting user is authorized to delete the comment
        if (comment.creatorId.toString() !== req.user.id) {
            return next(new ErrorHandler(`User not authorized to delete this comment`));
        }

        if (!comment) {
            return next(new ErrorHandler(`Comment does not exist with ID: ${req.params.commentId}`));
        }

        await comment.remove();

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
/* deleteComment = async (req, res, next) => {...}; */


/**/
/*
deleteReply()
NAME
    deleteReply - Deletes a reply within a comment.
SYNOPSIS
    deleteReply = async (req, res, next) => {...};
    req -> Request object containing the comment ID and reply ID.
    res -> Response object that carries a success status and the updated comment.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function deletes a reply within a comment based on the provided comment ID and reply ID.
    It checks if the requesting user is authorized to delete the reply and if the reply exists.
    If successful, it responds with a success status and the updated comment.
RETURNS
    None.
*/
/**/
exports.deleteReply = async (req, res, next) => {
    try {
        const replyID = req.params.replyId;
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return next(new ErrorHandler(`Comment does not exist with ID: ${req.params.commentId}`));
        }

        let doesReplyExist = false;

        // Filter out the reply to be deleted
        comment.replies = comment.replies.filter((reply, ind) => {
            if (reply.id.toString() === replyID) {
                doesReplyExist = true;
                if (reply.creatorId.toString() !== req.user.id) {
                    return next(new ErrorHandler(`User not authorized to delete this reply`));
                }
                return false;
            }
            return true;
        });

        // Check if the reply actually existed; if not, send an error
        if (!doesReplyExist) {
            return next(new ErrorHandler(`Reply with ID ${replyID} does not exist`));
        }

        await comment.save();

        res.status(200).json({
            success: true,
            comment,
        });
    } catch (error) {
        next(error);
    }
};
/* deleteReply = async (req, res, next) => {...}; */

 
/**/
/*
editComment()
NAME
    editComment - Edits a comment.
SYNOPSIS
    editComment = async (req, res, next) => {...};
    req -> Request object containing the comment ID and edited comment.
    res -> Response object that carries a success status and the updated comment.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to edit their own comment based on the provided comment ID.
    It checks if the requesting user is authorized to edit the comment and if the comment exists.
    If successful, it responds with a success status and the updated comment.
RETURNS
    None.
*/
/**/
exports.editComment = async (req, res, next) => {
    try {
        let comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return next(new ErrorHandler(`Comment does not exist with ID: ${req.params.commentId}`));
        }

        if (req.user.id !== comment.creatorId.toString()) {
            return next(new ErrorHandler(`User not authorized to edit this comment`));
        }

        const { editedComment } = req.body;
        const updatedComment = {
            comment: editedComment,
            edited: true,
        };

        comment = await Comment.findByIdAndUpdate(req.params.commentId, updatedComment, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            comment,
        });

    } catch (error) {
        next(error);
    }
};
/* editComment = async (req, res, next) => {...}; */

/**/
/*
editReply()
NAME
    editReply - Edits a reply.
SYNOPSIS
    editReply = async (req, res, next) => {...};
    req -> Request object containing the comment ID, reply ID, and edited reply.
    res -> Response object that carries a success status and the updated comment.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to edit their own reply within a comment based on the provided comment and reply IDs.
    It checks if the requesting user is authorized to edit the reply, if the comment and reply exist.
    If successful, it responds with a success status and the updated comment.
RETURNS
    None.
*/
/**/
exports.editReply = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return next(new ErrorHandler(`Comment does not exist with ID: ${req.params.commentId}`));
        }

        const { editedReply } = req.body;

        comment.replies.map((reply) => {
            if (reply.id.toString() === req.params.replyId) {
                if (reply.creatorId.toString() !== req.user.id) {
                    return next(new ErrorHandler(`User is not authorized to edit this reply`));
                }
                reply.reply = editedReply;
                reply.edited = true;
            }
            return reply;
        });

        await comment.save();

        res.status(200).json({
            success: true,
            comment,
        });

    } catch (error) {
        next(error);
    }
};
/* editReply = async (req, res, next) => {...}; */
