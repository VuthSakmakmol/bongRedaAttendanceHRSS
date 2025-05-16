const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['White Collar', 'Blue Collar'],
    required: true
  },
  subType: {
    type: String,
    default: null
  },
  jobTitles: {
    type: [String],
    default: []
  }
}, {
  timestamps: true // adds createdAt & updatedAt automatically
});

module.exports = mongoose.model('Department', DepartmentSchema);
