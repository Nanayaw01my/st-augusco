const express = require('express');
const GalleryImage = require('../models/GalleryImage');
const requireAuth = require('../middleware/auth');
const { makeUploader } = require('../config/cloudinary');

const router = express.Router();
const upload = makeUploader('gallery');

router.get('/', async (req, res) => {
  const items = await GalleryImage.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Image is required' });
  const image = await GalleryImage.create({
    imageUrl: req.file.path,
    caption: req.body.caption || '',
    order: Number(req.body.order) || 0,
  });
  res.status(201).json(image);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await GalleryImage.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
