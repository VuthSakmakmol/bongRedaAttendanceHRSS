const Attendance = require('../models/Attendance')

exports.bulkImport = async (req, res) => {
  try {
    const { records } = req.body // Array of objects with employeeId, date, timestamp, status, shift

    if (!Array.isArray(records)) {
      return res.status(400).json({ message: 'Invalid data format' })
    }

    const bulkOps = records.map(record => ({
      updateOne: {
        filter: { employeeId: record.employeeId, date: record.date },
        update: { $set: record },
        upsert: true
      }
    }))

    await Attendance.bulkWrite(bulkOps)
    res.json({ message: 'Attendance imported successfully' })

  } catch (err) {
    console.error('Import Error:', err)
    res.status(500).json({ message: 'Import failed' })
  }
}

exports.getAttendance = async (req, res) => {
  try {
    const { date, status } = req.query
    const filter = {}
    if (date) filter.date = date
    if (status) filter.status = status

    const records = await Attendance.find(filter).sort({ employeeId: 1 })
    res.json(records)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance' })
  }
}
