require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./server/config/db');

const authRoutes = require('./server/routes/auth');
const newsRoutes = require('./server/routes/news');
const galleryRoutes = require('./server/routes/gallery');
const departmentRoutes = require('./server/routes/departments');
const authorityRoutes = require('./server/routes/authorities');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/authorities', authorityRoutes);

// Admin dashboard (static)
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Public website (static)
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 10000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`AUGUSCO server running on port ${PORT}`)))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
