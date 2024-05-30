import Conversation from '../models/conversationModel.mjs'

// Function to send a message
export async function sendMessage (req, res) {
  const senderId = req.user._id; // Replace with actual user ID retrieval
  const recipientId = req.body.recipientId;
  const content = req.body.content;

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

    const newMessage = new Conversation.messageSchema({
      sender: senderId,
      recipient: recipientId,
      content: content
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
      .populate('messages.sender messages.recipient'); // Populate sender and recipient details

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
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId
    }).populate('participants', 'name images') // Populate user data for display
      .sort({ updatedAt: -1 }); // Sort by most recent update

    res.status(200).json(conversations); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve conversations' });
  }
};

