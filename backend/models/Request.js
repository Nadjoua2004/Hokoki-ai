const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, default: 'pending' }, // 'pending', 'accepted', 'rejected'
  timestamp: { type: Date, default: Date.now }
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
