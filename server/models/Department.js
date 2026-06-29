const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tag: { type: String, default: '' },
  icon: { type: String, default: '📚' },
  iconTheme: { type: String, enum: ['g', 'y'], default: 'g' },
  description: { type: String, default: '' },
  courses: [{ type: String }],
  hodName: { type: String, default: '' },
  hodPhotoUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
