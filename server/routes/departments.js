const express = require('express');
const Department = require('../models/Department');
const requireAuth = require('../middleware/auth');
const { makeUploader } = require('../config/cloudinary');

const router = express.Router();
const upload = makeUploader('departments');

router.get('/', async (req, res) => {
  const items = await Department.find().sort({ order: 1 });
  res.json(items);
});

router.post('/', requireAuth, upload.single('hodPhoto'), async (req, res) => {
  const { name, tag, icon, iconTheme, description, courses, hodName, order } = req.body;
  const dept = await Department.create({
    name, tag, icon, iconTheme, description,
    courses: courses ? courses.split(',').map(c => c.trim()).filter(Boolean) : [],
    hodName,
    order: Number(order) || 0,
    hodPhotoUrl: req.file ? req.file.path : '',
  });
  res.status(201).json(dept);
});

router.put('/:id', requireAuth, upload.single('hodPhoto'), async (req, res) => {
  const { name, tag, icon, iconTheme, description, courses, hodName, order } = req.body;
  const update = {
    name, tag, icon, iconTheme, description, hodName,
    order: Number(order) || 0,
  };
  if (courses !== undefined) update.courses = courses.split(',').map(c => c.trim()).filter(Boolean);
  if (req.file) update.hodPhotoUrl = req.file.path;
  const dept = await Department.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!dept) return res.status(404).json({ error: 'Not found' });
  res.json(dept);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
