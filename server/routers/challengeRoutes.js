const express = require("express");
const {
    createChallenge,
    updateAChallenge,
    deleteAChallenge,
    joinAChallenge,
    upvoteChallenge,
    quitAChallenge,
    getMyChallenges,
    searchChallenges,
    getAllFollowedChallenges,
    getAllUpvotesForAChallenge,
    dailyCheckInOnAChallenge,
    completeChallenge,
    getChallengesCreatedByMe,
    getAChallenge,
    getCheckedInMessages,
    checkStreak,
    getChallenges
    

} = require("../controllers/challengeController.js");
const router = express.Router();
const {isAuthenticatedUser, authorizedRoles} = require("../middleware/auth")

// create a challenge
router.route("/challenge/add").post(isAuthenticatedUser, createChallenge);
// update a challenge
router.route("/challenge/edit/:challengeId").put(isAuthenticatedUser, updateAChallenge);
// delete a challenge
router.route("/challenge/delete/:challengeId").delete(isAuthenticatedUser, deleteAChallenge);
// fetch a challenge
router.route("/challenge/:challengeId").get(isAuthenticatedUser, getAChallenge);
// get all challenges for a user has interacted with
router.route("/challenge/all/profile").post(isAuthenticatedUser, getChallenges);

// check streak
router.route("/challenge/streak/:challengeId").get(isAuthenticatedUser, checkStreak);

// join a challenge
router.route("/challenge/join/:challengeId").put(isAuthenticatedUser, joinAChallenge);
// upvote a challenge
router.route("/challenge/upvote/:challengeId").put(isAuthenticatedUser, upvoteChallenge);
// daily check in
router.route("/challenge/checkin/:challengeId").put(isAuthenticatedUser, dailyCheckInOnAChallenge);
// complete challenge
router.route("/challenge/complete/:challengeId").get(isAuthenticatedUser, completeChallenge);
// get latest reports
router.route("/challenge/checkedin/messages/:challengeId").get(isAuthenticatedUser, getCheckedInMessages);

// quit a challenge
router.route("/challenge/quit/:challengeId").get(isAuthenticatedUser, quitAChallenge);
// get all challenges I joined
router.route("/challenge/joined/me").post(isAuthenticatedUser, getMyChallenges);
// get chalenge created by me
router.route("/challenge/creator/me").post(isAuthenticatedUser, getChallengesCreatedByMe);

// search challenges by keyword
router.route("/challenge/all").post(isAuthenticatedUser, searchChallenges);
// get all followed people created challenges
router.route("/challenge/feed").post(isAuthenticatedUser, getAllFollowedChallenges);
// get all upvoters for a challenge.
router.route("/challenge/upvotes/:challengeId").get(isAuthenticatedUser, getAllUpvotesForAChallenge);






module.exports  = router;