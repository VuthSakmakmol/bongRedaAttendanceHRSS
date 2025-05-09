const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  provinceNameKh: String,
  districtNameKh: String,
  communeNameKh: String,
  villageNameKh: { type: String, default: null }
});

module.exports = mongoose.model('LocationKh', locationSchema);
