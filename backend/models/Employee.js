const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
  provinceNameKh: { type: String, default: '' },
  districtNameKh: { type: String, default: '' },
  communeNameKh: { type: String, default: '' },
  villageNameKh: { type: String, default: '' }
}, { _id: false })

const employeeSchema = new mongoose.Schema({

  
  employeeId: { type: String, default: '' },
  khmerName: { type: String, default: '' },
  latinName: { type: String, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
  dob: { type: Date, default: null },
  age: { type: Number, default: null },
  email: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  agentPhoneNumber: { type: String, default: '' },
  agentPerson: { type: String, default: '' },


  marriedStatus: { type: String, enum: ['Single', 'Married', ''], default: '' },
  spouseName: { type: String, default: '' },
  spouseContactNumber: { type: String, default: '' },
  education: {
    type: String,
    enum: ['High School', 'Bachelor', 'Master', 'PhD', ''],
    default: ''
  },
  religion: {
    type: String,
    enum: ['Islam', 'Buddhism', 'Christian', ''],
    default: ''
  },
  nationality: {
    type: String,
    enum: ['Khmer', 'Thai', 'Vietnamese', 'Indonesian', 'Sri Lankan', 'Indian', ''],
    default: ''
  },
  placeOfBirth: { type: addressSchema, default: () => ({}) },
  placeOfLiving: { type: addressSchema, default: () => ({}) },


  joinDate: { type: Date, default: null },
  department: { type: String, default: '' },
  position: { type: String, default: '' },
  line: { type: String, default: '' },
  team: { type: String, default: '' },
  section: { type: String, default: '' },
  shift: {
    type: String,
    enum: ['Day Shift', 'Night Shift', ''],
    default: ''
  },
  status: {
    type: String,
    enum: ['Working', 'Resign', 'Terminate', 'Abandon', 'Pass Away', 'Retirement', ''],
    default: ''
  },
  remark: { type: String, default: '' },



  idCard: { type: String, default: '' },
  idCardExpireDate: { type: Date, default: null },
  nssf: { type: String, default: '' },
  passport: { type: String, default: '' },
  passportExpireDate: { type: Date, default: null },
  visaExpireDate: { type: Date, default: null },
  medicalCheck: { type: String, default: '' },
  medicalCheckDate: { type: Date, default: null },
  workingBook: { type: String, default: '' },

  

  sourceOfHiring: {
    type: String,
    enum: ['Online', 'Called', 'Walk-in', 'Referral', ''],
    default: ''
  },
  introducerId: { type: String, default: '' },
  employeeType: {
    type: String,
    enum: ['Admin', 'Indirect', 'Operator', ''],
    default: ''
  },
  singleNeedle: { type: String, default: '' },
  overlock: { type: String, default: '' },
  coverstitch: { type: String, default: '' },
  totalMachine: { type: Number, default: 0 },

}, { timestamps: true })

module.exports = mongoose.model('Employee', employeeSchema)
