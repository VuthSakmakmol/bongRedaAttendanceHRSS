const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const admin = await Admin.findOne({ email })
    if (!admin) return res.status(404).json({ message: 'Admin not found' })

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' })

    res.json({
      user: {
        username: admin.username,
        email: admin.email
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}
