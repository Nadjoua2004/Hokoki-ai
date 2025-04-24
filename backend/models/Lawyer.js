const mongoose = require('mongoose');

// In models/Lawyer.js
const LawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phonenumb: { type: String, required: true },
  idcapa: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  agreeToTerms: { type: Boolean, default: false }
});
module.exports = mongoose.model('Lawyer', LawyerSchema);