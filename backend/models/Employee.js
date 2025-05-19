const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  provinceNameKh: { type: String },
  districtNameKh: { type: String },
  communeNameKh: { type: String },
  villageNameKh: { type: String }
}, { _id: false });

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  khmerName: {type: String, required: true},
  gender: String,
  email: String,
  position: String,
  department: String,
  dob: { type: Date, required: true },  
  joinDate: { type: Date, required: true },
  nssf: { type: String, match: /^\d{15}$/, required: true },
  idCard: { type: String, required: true },
  idCardExpireDate: { type: Date},
  passport: { type: String, default: '' },
  passportExpireDate: {type: Date},
  visaExpireDate: { type: Date, },
  healthCheck: { type: String, required: true },
  workingBook: { type: String, default: '' },

  shift: {
    type: String,
    enum: ['Day Shift', 'Night Shift'],
    default: 'Day Shift'
  },
  status: {
    type: String,
    enum: ['Working', 'Resign', 'Terminate', 'Abandon', 'Pass Away', 'Retirement'],
    default: 'Working'
  },
  remark: { type: String, default: '' },
  placeOfBirth: { type: addressSchema, required: true },
  placeOfLiving: { type: addressSchema } // optional — can match or differ
});

module.exports = mongoose.model('Employee', employeeSchema);
