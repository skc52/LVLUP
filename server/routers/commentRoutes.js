const express = require("express");
const {
    addNewComment,
    addReplies,
    showCommentsForAProject,
    deleteComment,
    deleteReply,
    editComment,
    editReply,
    showAllComments
} = require("../controllers/commentController.js");
const router = express.Router();
const {isAuthenticatedUser, authorizedRoles} = require("../middleware/auth")


// add a new comment
router.route("/comment/add/:postId").post(isAuthenticatedUser, addNewComment);
// add a reply to a comment
router.route("/comment/reply/:commentId").post(isAuthenticatedUser, addReplies);
// show all comments and replies for a post
router.route("/comment/all/post/:postId").get(isAuthenticatedUser, showCommentsForAProject);
router.route("/comment/all").get(isAuthenticatedUser, showAllComments);

// delete a comment
router.route("/comment/delete/:commentId").delete(isAuthenticatedUser, deleteComment);
// delete a reply from a comment
router.route("/comment/reply/delete/:commentId/:replyId").delete(isAuthenticatedUser, deleteReply);
// edit a comment
router.route("/comment/edit/:commentId").put(isAuthenticatedUser, editComment);
// edit a reply
router.route("/comment/reply/edit/:commentId/:replyId").put(isAuthenticatedUser, editReply);

module.exports  = router;