const express   = require('express');
const router    = express.Router();
const Book      = require('../Book');
const adminAuth = require('../adminAuth');

// Public: list all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: create a book
router.post('/', adminAuth, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: update a book
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: delete a book
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    res.json({ message: 'Book deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
