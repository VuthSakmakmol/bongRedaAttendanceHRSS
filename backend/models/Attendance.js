const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: String, // Format: 'YYYY-MM-DD'
    required: true,
    index: true
  },
  timestamp: {
    type: Date
  },
  status: {
    type: String,
    enum: ['On Time', 'Late', 'Absent'],
    default: 'Absent'
  },
  shift: {
    type: String,
    enum: ['Day Shift', 'Night Shift'],
    default: 'Day Shift'
  }
}, { timestamps: true })

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('Attendance', attendanceSchema)
