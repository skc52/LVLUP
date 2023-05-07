const express = require("express");
const {
   createNotification,
   showNotifications,
   deleteNotification,
   seenNotification

} = require("../controllers/notificationsController.js");
const router = express.Router();
const {isAuthenticatedUser, authorizedRoles} = require("../middleware/auth")

// create
router.route("/notification/add/:userId").post(isAuthenticatedUser, createNotification);
// delete
router.route("/notification/delete/:notificationId").post(isAuthenticatedUser, deleteNotification);
// show
router.route("/notification/all").get(isAuthenticatedUser, showNotifications);
// seen
router.route("/notification/all/seen").put(isAuthenticatedUser, seenNotification)

module.exports  = router