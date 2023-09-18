const mongoose = require('mongoose');

/*
messageSchema()
NAME
    messageSchema - Schema for representing messages between users.
SYNOPSIS
    const messageSchema = new mongoose.Schema({ ... });
DESCRIPTION
    This schema defines the structure for representing messages exchanged between users in a chat system.
    Messages contain sender and recipient information, message text, and a timestamp.
FIELDS
    - sender: ObjectId (required)
        The ID of the user who sent the message.
    - recipient: ObjectId (required)
        The ID of the user who is the recipient of the message.
    - text: String (required)
        The textual content of the message.
    - createdAt: Date
        The date and time when the message was created.
INDEXES
    None.
*/

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
/* const messageSchema = new mongoose.Schema({ ... });*/
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
