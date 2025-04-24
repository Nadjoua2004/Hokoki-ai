const mongoose = require('mongoose');

const LawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phonenumb: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idc: { type: String, required: true, unique: true }, // Lawyer ID
  password: { type: String, required: true },
  agreeToTerms: { type: Boolean, default: false }
});
module.exports = mongoose.model('Lawyer', LawyerSchema, 'lawyers');
