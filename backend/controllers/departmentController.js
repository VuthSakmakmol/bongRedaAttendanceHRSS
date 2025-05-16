const Department = require('../models/Department')

// Return only name and jobTitles for frontend use
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({}, 'name jobTitles')
    res.json(departments)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch departments', error: err.message })
  }
}
