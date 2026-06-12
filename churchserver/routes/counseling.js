const express    = require('express');
const router     = express.Router();
const Counseling = require('../Counseling');
const adminAuth  = require('../adminAuth');

// Public: submit a counseling request
router.post('/', async (req, res) => {
  try {
    const request = await Counseling.create(req.body);
    res.status(201).json({ message: 'Counseling request received.', id: request._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: list all counseling requests
router.get('/', adminAuth, async (req, res) => {
  try {
    const requests = await Counseling.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: update request status
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const request = await Counseling.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: delete
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const request = await Counseling.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    res.json({ message: 'Counseling request deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
