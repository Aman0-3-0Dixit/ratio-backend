// import  { Conversation, Message } from '../models/conversationModel.mjs'
import {Conversation,Message} from '../models/conversationModel.mjs'


export async function createConversation(req, res) {
  const userId1 = req.params.userId1; // Replace with actual user ID retrieval
  const userId2 = req.params.userId2; // Replace with actual user ID retrieval

  try {
    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] }
    });

    if (!conversation) {
      // Create a new conversation if it doesn't exist
      conversation = new Conversation({
        participants: [userId1, userId2],
        messages: [] // No messages initially
      });

      await conversation.save();
      res.json({ message: 'Conversation created successfully!' });
    } else {
      res.json({ message: 'Conversation already exists!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};



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

