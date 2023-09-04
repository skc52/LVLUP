const User = require("../models/userModel.js");
const Message = require("../models/messagesModel");
const ErrorHandler = require("../utils/errorHandler.js");

/**/
/*
create()
NAME
    create - Creates a new message.
SYNOPSIS
    create = async (req, res, next) => {...};
    req -> Request object containing sender ID, recipient ID, and message text.
    res -> Response object that carries the created message.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows a user to create and send a new message to a recipient. It saves the message in the database
    and responds with the created message.
RETURNS
    None.
*/
/**/
exports.create = async (req, res, next) => {
  try {
      let message = new Message({
          sender: req.user.id,
          recipient: req.params.id,
          text: req.body.text,
      });

      const user = await User.findById(req.user.id);

      await message.save();

      res.status(201).json(message);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
};
/* create = async (req, res, next) => {...}; */

  
/**/
/*
getConversation()
NAME
    getConversation - Retrieves a conversation between two users.
SYNOPSIS
    getConversation = async (req, res, next) => {...};
    req -> Request object containing the recipient's ID.
    res -> Response object that carries the retrieved conversation.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves a conversation between the authenticated user and another user specified by their ID.
    It fetches the messages exchanged between the two users and responds with the conversation.
RETURNS
    None.
*/
/**/
exports.getConversation = async (req, res, next) => {
  try {
      console.log("GET CONVERSATION");
      const messages = await Message.find({
          $or: [
              { sender: req.user.id, recipient: req.params.id },
              { sender: req.params.id, recipient: req.user.id },
          ],
      })
          .populate('sender recipient', 'name email')
          .sort('-createdAt');

      res.status(201).json(messages);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
};
/* getConversation = async (req, res, next) => {...}; */


  





/**/
/*
getConversationList()
NAME
    getConversationList - Retrieves a list of conversations for the authenticated user.
SYNOPSIS
    getConversationList = async (req, res, next) => {...};
    req -> Request object containing optional name filter.
    res -> Response object that carries the list of conversations.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function retrieves a list of conversations involving the authenticated user. It filters users by name
    (if provided) and fetches messages exchanged with those users. It then formats the response with unique
    participants and their last messages.
RETURNS
    None.
*/
/**/
exports.getConversationList = async (req, res, next) => {
  try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      // Filter users by name (if name is provided in req.body)
      const nameFilter = req.body.name ? { name: { $regex: req.body.name, $options: "i" } } : {};
      const users = await User.find({
          _id: { $ne: userId }, // Exclude current user
          ...nameFilter,
      }, '_id name');

      let usersIds = [];

      for (var i = 0; i < users.length; i++) {
          usersIds.push(users[i]._id.toString());
      }

      // Find all messages that involve the user
      const messages = await Message.find({
          $or: [{ sender: userId }, { recipient: userId }],
      })
          .populate('sender', '_id name')
          .populate('recipient', '_id name')
          .sort('-createdAt');

      // Extract the unique participants and format the response
      const participants = new Set();
      let conversationList = [];
      messages.forEach((message) => {
          const otherParticipant =
              message.sender._id.toString() !== userId
                  ? message.sender
                  : message.recipient;
          if (!participants.has(otherParticipant._id.toString())) {
              participants.add(otherParticipant._id.toString());
              // Only include participants that match the name filter (if any)
              if (!nameFilter.name || otherParticipant.name.match(nameFilter.name)) {
                  conversationList.push({
                      id: otherParticipant._id,
                      name: otherParticipant.name,
                      lastMessage: message.text,
                  });
              }
          }
      });
      // Filter conversations to include only users with matching IDs
      conversationList = conversationList.filter((convo) => {
          return usersIds.includes(convo.id.toString());
      });

      res.status(200).json(conversationList);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error });
  }
};
/* getConversationList = async (req, res, next) => {...}; */

/**/
/*
deleteAllMessages()
NAME
    deleteAllMessages - Deletes all messages in the system (for admin use).
SYNOPSIS
    deleteAllMessages = async (req, res, next) => {...};
    req -> Request object (admin access required).
    res -> Response object indicating the success of the operation.
    next -> The next middleware function in the pipeline.
DESCRIPTION
    This function allows an admin to delete all messages in the system. It performs a bulk deletion
    of all messages in the database.
RETURNS
    None.
*/
/**/
exports.deleteAllMessages = async (req, res, next) => {
  try {
    // Check if the user has admin access (you may add admin role checking logic here)
    if (!req.user.isAdmin) {
      return next(new ErrorHandler('Admin access required to delete all messages.'));
    }

    // Perform a bulk deletion of all messages
    await Message.deleteMany({});

    res.status(200).json({ success: true, message: 'All messages have been deleted.' });
  } catch (err) {
    next(err);
  }
};
/* deleteAllMessages = async (req, res, next) => {...}; */
