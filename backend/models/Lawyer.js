const mongoose = require('mongoose');

const LawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phonenumb: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idc: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  agreeToTerms: { type: Boolean, default: false },
  photo: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
  experienceYears: { type: Number, default: 0 },
  experienceSummary: { type: String, default: '' },
  wilaya: { type: String, default: 'Not specified' },
  languages: { type: [String], default: [] },
  specialty: { type: String, default: '' },
  lawFirm: { type: String, default: '' },
  clients: { type: Number, default: 0 },
  cases: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lawyer', LawyerSchema, 'lawyers');