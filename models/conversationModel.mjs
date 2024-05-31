import mongoose from 'mongoose'
import User from './userModel.mjs';
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
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Optional fields (add as needed)
  attachments: [{
    type: String // URL or path to attachment
  }],
  seen: {
    type: Boolean,
    default: false
  }
},{
  timestamps: true  // Automatically add `createdAt` and `updatedAt` fields
});

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [messageSchema],  // Array of message subdocuments
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema)
export { Conversation, Message }; 