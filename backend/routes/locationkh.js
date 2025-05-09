const express = require('express');
const router = express.Router();
const LocationKh = require('../models/LocationKh');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const all = await LocationKh.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get unique provinces
router.get('/provinces', async (req, res) => {
  try {
    const provinces = await LocationKh.aggregate([
      { $group: { _id: '$provinceNameKh' } },
      { $sort: { _id: 1 } }
    ]);
    res.json(provinces.map(p => p._id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get unique districts for selected province
router.get('/districts', async (req, res) => {
  try {
    const { province } = req.query;
    if (!province) return res.status(400).json({ message: 'Missing province' });

    const districts = await LocationKh.aggregate([
      { $match: { provinceNameKh: province } },
      { $group: { _id: '$districtNameKh' } },
      { $sort: { _id: 1 } }
    ]);
    res.json(districts.map(d => d._id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get unique communes for selected district
router.get('/communes', async (req, res) => {
  try {
    const { district } = req.query;
    if (!district) return res.status(400).json({ message: 'Missing district' });

    const communes = await LocationKh.aggregate([
      { $match: { districtNameKh: district } },
      { $group: { _id: '$communeNameKh' } },
      { $sort: { _id: 1 } }
    ]);
    res.json(communes.map(c => c._id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
