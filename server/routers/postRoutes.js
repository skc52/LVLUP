const express = require("express");
const {
    createAPost,
    updateAPost,
    deleteAPost,
    likeAPost,
    getAllLikesForAPost,
    getAllPosts,
    getAPost,
    getAllFollowedPosts,
    getMyPosts,
    addComment,
    getUserPosts,
    deleteAllPosts

} = require("../controllers/postController.js");
const router = express.Router();
const {isAuthenticatedUser, authorizedRoles} = require("../middleware/auth")


// create a post
router.route("/post/add").post(isAuthenticatedUser, createAPost);
// update a post

router.route("/post/update/:postId").post(isAuthenticatedUser, updateAPost);
// delete a post
router.route("/motivation/delete/:postId").delete(isAuthenticatedUser, deleteAPost);
// like a post
router.route("/post/toggleLike/:postId").put(isAuthenticatedUser, likeAPost);
router.route("/add/comment/:postId").post(isAuthenticatedUser, addComment);

// get a users posts
router.route("/posts/all/:userId").get(isAuthenticatedUser, getUserPosts);

// delete all posts
router.route("/posts/delete/all").delete(isAuthenticatedUser, deleteAllPosts);

// get all likes

router.route("/motivation/likes/all/:postId").get(isAuthenticatedUser, getAllLikesForAPost);
// get all posts
router.route("/posts/all").get(isAuthenticatedUser, getAllPosts);
// get a post by id
router.route("/motivation/:postId").get(isAuthenticatedUser, getAPost);
// get all followed posts
router.route("/motivation/all/followed").get(isAuthenticatedUser, getAllFollowedPosts);
// get my posts
router.route("/motivation/all/me").get(isAuthenticatedUser, getMyPosts);

module.exports  = router;