const express = require("express");
const {
    createJournal,
    editJournal,
    deleteJournal,
    getAJournal,
    showJournals

} = require("../controllers/journalController.js");
const router = express.Router();
const {isAuthenticatedUser, authorizedRoles} = require("../middleware/auth")


// create
router.route("/journal/add").post(isAuthenticatedUser, createJournal);
// update
router.route("/journal/edit/:journalId").put(isAuthenticatedUser, editJournal);
// delete
router.route("/journal/delete/:journalId").delete(isAuthenticatedUser, deleteJournal);
// get
router.route("/journal/get/:journalId").get(isAuthenticatedUser, getAJournal);
// show all - includes search filter
router.route("/journal/all").get(isAuthenticatedUser, showJournals);


module.exports  = router;