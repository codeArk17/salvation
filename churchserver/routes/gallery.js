const express     = require('express');
const router      = express.Router();
const GalleryItem = require('../Gallery');
const adminAuth   = require('../adminAuth');

// Public: list all gallery items (optionally filter by mediaType query param)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.mediaType ? { mediaType: req.query.mediaType } : {};
    const items  = await GalleryItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: add a gallery item
router.post('/', adminAuth, async (req, res) => {
  try {
    const item = await GalleryItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: delete a gallery item
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Gallery item not found.' });
    res.json({ message: 'Gallery item deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
