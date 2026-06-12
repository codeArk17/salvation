const express   = require('express');
const router    = express.Router();
const Contact   = require('../Contact');
const adminAuth = require('../adminAuth');

// Public: submit a contact message
router.post('/', async (req, res) => {
  try {
    const msg = await Contact.create(req.body);
    res.status(201).json({ message: 'Message received. We will respond soon.', id: msg._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: list all messages
router.get('/', adminAuth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: delete a message
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const msg = await Contact.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found.' });
    res.json({ message: 'Message deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
