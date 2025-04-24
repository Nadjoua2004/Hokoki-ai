const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    conversationId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: 'Conversation'  // Add this line
    },
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      ref: 'User'  // Changed from refPath
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,  // Added required
      ref: 'User'  
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  });
module.exports = mongoose.model('Message', MessageSchema);