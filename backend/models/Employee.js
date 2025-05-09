const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  provinceNameKh: { type: String },
  districtNameKh: { type: String },
  communeNameKh: { type: String },
  villageNameKh: { type: String }
}, { _id: false });

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  position: String,
  department: String,

  placeOfBirth: { type: addressSchema, required: true },
  placeOfLiving: { type: addressSchema } // optional — can match or differ
});

module.exports = mongoose.model('Employee', employeeSchema);
