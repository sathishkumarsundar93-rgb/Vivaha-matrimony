const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { gender, age, religion, city, search } = req.query;
    let filter = { _id: { $ne: req.user.id } };

    if (gender && gender !== 'all')     filter.gender   = gender;
    if (religion && religion !== 'all') filter.religion = religion;
    if (city && city !== 'all')         filter.city     = city;
    if (age && age !== 'all') {
      const [min, max] = age.split('-');
      filter.age = { $gte: parseInt(min), $lte: parseInt(max) };
    }
    if (search) {
      filter.$or = [
        { name:       { $regex: search, $options: 'i' } },
        { profession: { $regex: search, $options: 'i' } },
        { city:       { $regex: search, $options: 'i' } }
      ];
    }
    const profiles = await User.find(filter).select('-password');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const profile = await User.findById(req.params.id).select('-password');
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
