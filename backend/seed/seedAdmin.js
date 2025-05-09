const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const Admin = require('../models/Admin')

dotenv.config()

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI)

  const existing = await Admin.findOne({ email: process.env.DEFAULT_ADMIN_EMAIL })
  if (existing) {
    console.log('Admin already exists')
    return process.exit()
  }

  const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10)

  await Admin.create({
    username: process.env.DEFAULT_ADMIN_USERNAME,
    email: process.env.DEFAULT_ADMIN_EMAIL,
    password: hashedPassword
  })

  console.log('Admin seeded successfully')
  process.exit()
}

seedAdmin()
