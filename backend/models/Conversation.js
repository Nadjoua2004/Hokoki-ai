const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    validate: [arrayLimit, '{PATH} must have exactly 2 items']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validate exactly 2 participants
function arrayLimit(val) {
  return val.length === 2;
}

// Create a proper compound index that ensures unique pairs
conversationSchema.index(
  { participants: 1 },
  { 
    unique: true,
    collation: { locale: 'en', strength: 2 }
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;