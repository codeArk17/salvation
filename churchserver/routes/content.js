const express   = require('express');
const router    = express.Router();
const Content   = require('../Content');
const adminAuth = require('../adminAuth');

// Public: list all content items
router.get('/', async (req, res) => {
  try {
    const items = await Content.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: create content
router.post('/', adminAuth, async (req, res) => {
  try {
    const item = await Content.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: update content
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const item = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Content not found.' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: delete content
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Content not found.' });
    res.json({ message: 'Content deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
