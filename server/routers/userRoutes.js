const express = require("express");
const { default: isIBAN } = require("validator/lib/isIBAN");
const {registerUser, loginUser, logoutUser, changePassword, updateUser, getAUser, getAllUsers, getAllUsersRegex,
    sendActivateOTP,
    activateAccount,
    sendResetPasswordOTP,
    resetPassword,
    deleteMyAccount,
    sendFollowRequest,
    acceptFollowRequest,
    unfollow,
    removeFollowing,
    getMyProfile,
    getAllFollowRequests,
    getAllNoMessagedUsers

} = require("../controllers/userControllers");
const router = express.Router();
const {isAuthenticatedUser, authorizedRoles} = require("../middleware/auth")



//user routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser);
router.route("/changePassword").post(isAuthenticatedUser, changePassword);
router.route("/me").get(isAuthenticatedUser, getMyProfile)

router.route("/messages/no").get(isAuthenticatedUser, getAllNoMessagedUsers)

// send activate otp
router.route("/me/sendactivateOTP").get(isAuthenticatedUser, sendActivateOTP);
// activate account
router.route("/me/activate").post(isAuthenticatedUser, activateAccount);
// get all follow requests;
router.route("/me/followRequests").get(isAuthenticatedUser, getAllFollowRequests);


// get all users
router.route("/users/all").get(isAuthenticatedUser, getAllUsers);
router.route("/users/search").post(isAuthenticatedUser, getAllUsersRegex);
router.route("/user/:id").get(isAuthenticatedUser, getAUser);

//updateProfile
router.route("/me/update").post(isAuthenticatedUser, updateUser);

// send reset password otp
router.route("/sendResetPasswordOTP").post( sendResetPasswordOTP);
// reset passeord
router.route("/resetPassword").post( resetPassword);

//deleteUser
router.route("/me/delete").delete(isAuthenticatedUser, deleteMyAccount);

// send follow request
router.route("/connect/request/send/:user2id").put(isAuthenticatedUser, sendFollowRequest);
// accept follow request
router.route("/connect/request/accept/:user2id").put(isAuthenticatedUser, acceptFollowRequest);

// unfollow 
router.route("/connect/unfollow/:user2id").put(isAuthenticatedUser, unfollow);

// delete following
router.route("/connect/removeFollowing/:user2id").put(isAuthenticatedUser, removeFollowing);

//TODO: getAllUsers

//TODO: getAUserByID

//TODO: getUsersByName



module.exports  = router;