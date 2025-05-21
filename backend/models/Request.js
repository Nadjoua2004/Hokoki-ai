const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  lawyerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lawyer',
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending' 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Add compound index to prevent duplicate requests
requestSchema.index({ userId: 1, lawyerId: 1 }, { unique: true });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;