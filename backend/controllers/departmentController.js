const Department = require('../models/Department')

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({}, 'name jobTitles')

    // Deduplicate by name (keep the first occurrence)
    const unique = []
    const seen = new Set()

    for (const dept of departments) {
      if (!seen.has(dept.name)) {
        seen.add(dept.name)
        unique.push(dept)
      }
    }

    res.json(unique)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch departments', error: err.message })
  }
}
