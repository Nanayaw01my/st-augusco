const express = require('express');
const News = require('../models/News');
const requireAuth = require('../middleware/auth');
const { makeUploader } = require('../config/cloudinary');

const router = express.Router();
const upload = makeUploader('news');

// Public: list published news
router.get('/', async (req, res) => {
  const items = await News.find({ published: true }).sort({ publishedAt: -1 });
  res.json(items);
});

// Admin: list all (including unpublished)
router.get('/admin', requireAuth, async (req, res) => {
  const items = await News.find().sort({ publishedAt: -1 });
  res.json(items);
});

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  const { title, category, excerpt, body, published, publishedAt } = req.body;
  const news = await News.create({
    title,
    category,
    excerpt,
    body,
    published: published !== 'false',
    publishedAt: publishedAt || Date.now(),
    imageUrl: req.file ? req.file.path : '',
  });
  res.status(201).json(news);
});

router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  const { title, category, excerpt, body, published, publishedAt } = req.body;
  const update = { title, category, excerpt, body, published: published !== 'false', publishedAt };
  if (req.file) update.imageUrl = req.file.path;
  const news = await News.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!news) return res.status(404).json({ error: 'Not found' });
  res.json(news);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
