const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
  villageNameKh: { type: String, required: true },
  communeNameKh: { type: String, required: true },
  districtNameKh: { type: String, required: true },
  provinceNameKh: { type: String, required: true }
});

module.exports = mongoose.model('Village', villageSchema);
