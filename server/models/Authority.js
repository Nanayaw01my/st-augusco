const mongoose = require('mongoose');

const authoritySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  group: { type: String, enum: ['headmaster', 'assistant', 'officer'], default: 'officer' },
  icon: { type: String, default: 'fa-user-tie' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Authority', authoritySchema);
