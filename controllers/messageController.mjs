// import  { Conversation, Message } from '../models/conversationModel.mjs'
import {Conversation,Message} from '../models/conversationModel.mjs'
// Function to send a message
export async function sendMessage (req, res) {
  const senderId = req.params.userId; // Replace with actual user ID retrieval
  const recipientId = req.body.recipientId;
  const content = req.body.content;
  const attachments = req.body.attachments;

  try {
    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] }
    });

    if (!conversation) {
      // Create a new conversation if it doesn't exist
      conversation = new Conversation({
        participants: [senderId, recipientId]
      });
    }

    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      content: content,
      attachments:attachments
    });

    conversation.messages.push(newMessage);
    await conversation.save();

    res.json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Function to retrieve messages for a conversation
export async function getConversationMessages(req, res) {
  try { 
    const conversation = await Conversation.findById(req.params.conversationId)

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

// Function to retrieve a user's conversations
export async function getUserConversations  (req, res){
  try {
    // const userId = req.params.userId;
    console.log(req.params);
    const userId = req.params.userId;
    const conversations = await Conversation.find({
      participants: { $all: [userId] }
            })
    .sort({ updatedAt: -1 }); // Sort by most recent update
      console.log("Conversations found:", conversations);
    res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    console.log('userId:', userId);
    res.status(500).json({ error: 'Failed to retrieve conversations' });
  }
};

