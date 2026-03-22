const express = require('express');
const router = express.Router();
const Interest = require('../models/Interest');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/send/:toUserId', auth, async (req, res) => {
  try {
    const toUser = await User.findById(req.params.toUserId);
    if (!toUser) return res.status(404).json({ msg: 'User not found' });
    if (toUser.id === req.user.id) return res.status(400).json({ msg: 'Cannot send interest to yourself' });

    const existing = await Interest.findOne({ fromUser: req.user.id, toUser: req.params.toUserId });
    if (existing) return res.status(400).json({ msg: 'Interest already sent' });

    const interest = new Interest({ fromUser: req.user.id, toUser: req.params.toUserId });
    await interest.save();
    res.json({ msg: 'Interest sent successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/sent', auth, async (req, res) => {
  try {
    const interests = await Interest.find({ fromUser: req.user.id }).populate('toUser', '-password');
    res.json(interests);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/received', auth, async (req, res) => {
  try {
    const interests = await Interest.find({ toUser: req.user.id }).populate('fromUser', '-password');
    res.json(interests);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:interestId', auth, async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'rejected'].includes(status))
    return res.status(400).json({ msg: 'Invalid status' });
  try {
    const interest = await Interest.findById(req.params.interestId);
    if (!interest) return res.status(404).json({ msg: 'Interest not found' });
    if (interest.toUser.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });
    interest.status = status;
    await interest.save();
    res.json(interest);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
