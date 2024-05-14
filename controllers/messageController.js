const Conversation = require('../models/messagesModel');

// Function to send a message
exports.sendMessage = async (req, res) => {
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
exports.getConversationMessages = async (req, res) => {
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

module.exports = exports;
