const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  excerpt: { type: String, required: true },
  body: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  publishedAt: { type: Date, default: Date.now },
  published: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
