const express = require('express');
const Authority = require('../models/Authority');
const requireAuth = require('../middleware/auth');
const { makeUploader } = require('../config/cloudinary');

const router = express.Router();
const upload = makeUploader('authorities');

router.get('/', async (req, res) => {
  const items = await Authority.find().sort({ group: 1, order: 1 });
  res.json(items);
});

router.post('/', requireAuth, upload.single('photo'), async (req, res) => {
  const { name, role, description, email, phone, group, icon, order } = req.body;
  const authority = await Authority.create({
    name, role, description, email, phone, group, icon,
    order: Number(order) || 0,
    photoUrl: req.file ? req.file.path : '',
  });
  res.status(201).json(authority);
});

router.put('/:id', requireAuth, upload.single('photo'), async (req, res) => {
  const { name, role, description, email, phone, group, icon, order } = req.body;
  const update = { name, role, description, email, phone, group, icon, order: Number(order) || 0 };
  if (req.file) update.photoUrl = req.file.path;
  const authority = await Authority.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!authority) return res.status(404).json({ error: 'Not found' });
  res.json(authority);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await Authority.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
