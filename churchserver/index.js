const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Vite default port
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/books',       require('./routes/books'));
app.use('/api/content',     require('./routes/content'));
app.use('/api/prayers',     require('./routes/prayers'));
app.use('/api/donations',   require('./routes/donations'));
app.use('/api/projects',    require('./routes/projects'));
app.use('/api/events',      require('./routes/events'));
app.use('/api/stream',      require('./routes/stream'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/counseling',  require('./routes/counseling'));
app.use('/api/contact',     require('./routes/contact'));
app.use('/api/volunteers',  require('./routes/volunteers'));
app.use('/api/gallery',     require('./routes/gallery'));

// ─── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'Salvation Series API running ✅' }));

// ─── MongoDB Connection ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://dami594933:salvation2024@cluster0.rocypvr.mongodb.net/?appName=Cluster0';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
