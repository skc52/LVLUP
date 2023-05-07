const express = require("express");
const {isAuthenticatedUser} = require("../middleware/auth");
const router = express.Router();
const {create, getConversation, getConversationList, deleteAllMessages } = require("../controllers/messageController");



// router.post('/message/create/:id', isAuthenticatedUser, create);
// router.get('/conversations/:id', isAuthenticatedUser, getConversation);
// router.get('/conversations',isAuthenticatedUser, getConversationList);


router.route("/message/create/:id").post(isAuthenticatedUser, create);
router.route("/conversation/:id").get(isAuthenticatedUser, getConversation);
router.route("/conversations").post(isAuthenticatedUser, getConversationList);
router.route("/conversations/delete/all").delete(isAuthenticatedUser, deleteAllMessages)


module.exports = router;