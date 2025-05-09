const Village = require('../models/Village');

// Create
exports.createVillage = async (req, res) => {
  try {
    const village = new Village(req.body);
    await village.save();
    res.status(201).json(village);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Read all
exports.getVillages = async (req, res) => {
  try {
    const villages = await Village.find();
    res.json(villages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateVillage = async (req, res) => {
  try {
    const village = await Village.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!village) return res.status(404).json({ message: 'Village not found' });
    res.json(village);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.deleteVillage = async (req, res) => {
  try {
    const village = await Village.findByIdAndDelete(req.params.id);
    if (!village) return res.status(404).json({ message: 'Village not found' });
    res.json({ message: 'Village deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
