const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// Get all unique provinces
router.get('/provinces', async (req, res) => {
  try {
    const provinces = await Location.distinct('provinceNameKh');
    res.json(provinces);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch provinces' });
  }
});

// Get districts by province
router.get('/districts', async (req, res) => {
  const { province } = req.query;
  if (!province) return res.status(400).json({ error: 'Missing province' });

  try {
    const districts = await Location.find({ provinceNameKh: province }).distinct('districtNameKh');
    res.json(districts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch districts' });
  }
});

// Get communes by province and district
router.get('/communes', async (req, res) => {
  const { province, district } = req.query;
  if (!province || !district) {
    return res.status(400).json({ error: 'Missing province or district' });
  }

  try {
    const communes = await Location.find({
      provinceNameKh: province,
      districtNameKh: district
    }).distinct('communeNameKh');
    res.json(communes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch communes' });
  }
});

module.exports = router;
