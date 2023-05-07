const User = require("../models/userModel.js");
const Message = require("../models/messagesModel");
const ErrorHandler = require("../utils/errorHandler.js");

exports.create = async (req, res, next) => {
    try {
      let message = new Message({
        sender: req.user.id,
        recipient: req.params.id,
        text: req.body.text
      });
      // const otherParty = await User.findById(req.params.id);
      const user = await User.findById(req.user.id)

      await message.save();
      
      res.status(201).json(message);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  };
  
  exports.getConversation = async (req, res, next) => {
    try {
      console.log("GET CONVERSATION")
      const messages = await Message.find({
        $or: [
          { sender: req.user.id, recipient: req.params.id },
          { sender: req.params.id, recipient: req.user.id }
        ]
      }).populate('sender recipient', 'name email').sort('-createdAt');
  
      res.status(201).json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  };


  // useless code
   exports.getConversationList2 = async (req, res, next) => {

    try {
      console.log("heres, ", req.body.name)
      const userId = req.user.id
      const user = await User.findById(req.user.id)

      const users = await User.find({
          name: { $regex: req.body.name, $options: "i" },
      
      })
      // Find all messages that involve the user
      const messages = await Message.find({
        $or: [{ sender: user._id }, { recipient: user._id }],
        $or: [
          { "sender.name": { $regex: req.body.name, $options: "i" } },
          { "recipient.name": { $regex: req.body.name, $options: "i" } },
        ],
      })
        .populate('sender', '_id name')
        .populate('recipient', '_id name')
        .sort('-createdAt');

    
  
      // Extract the unique participants and format the response
      const participants = new Set();
      const conversationList = [];
      messages.forEach(message => {
        const otherParticipant =
          message.sender._id.toString() !== userId
            ? message.sender
            : message.recipient;
        if (!participants.has(otherParticipant._id.toString())) {
          participants.add(otherParticipant._id.toString());
          conversationList.push({
            id: otherParticipant._id,
            name: otherParticipant.name,
            // avatar: otherParticipant.avatar,
            lastMessage:message.text
          });
        }
      });
      
      
      res.status(200).json(conversationList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  };





exports.getConversationList = async (req, res, next) => {
  try {
    console.log("here, ", req.body.name)

    const userId = req.user.id;
    const user = await User.findById(userId);

    // Filter users by name (if name is provided in req.body)
    const nameFilter = req.body.name ? { name: { $regex: req.body.name, $options: "i" } } : {};
    const users = await User.find({
      _id: { $ne: userId }, // Exclude current user
      ...nameFilter
    }, '_id name');


    let usersIds = [];

    for (var i = 0; i < users.length; i++){
      usersIds.push(users[i]._id.toString());
    }
    

    // Find all messages that involve the user
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender', '_id name')
      .populate('recipient', '_id name')
      .sort('-createdAt');

    // Extract the unique participants and format the response
    const participants = new Set();
    let conversationList = [];
    messages.forEach(message => {
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
            lastMessage: message.text
          });
        }
      }
    });
    //filter conversations
    console.log(usersIds);
    conversationList = conversationList.filter((convo)=>{
      console.log( usersIds.includes(convo.id.toString()));
      
      return usersIds.includes(convo.id.toString());
    })
    console.log(conversationList)

    res.status(200).json(conversationList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};


// DELETE ALL MESSAGES - ADMIN
exports.deleteAllMessages = async (req, res, next) => {
  try {
    await Message.deleteMany({});
    res.status(200).json({ success: true, message: 'All messages have been deleted.' });
  } catch (err) {
    next(err);
  }
};