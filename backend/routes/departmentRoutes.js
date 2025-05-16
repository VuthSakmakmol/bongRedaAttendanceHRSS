const express = require('express')
const router = express.Router()
const departmentController = require('../controllers/departmentController')

// GET /departments
router.get('/', departmentController.getAllDepartments)

module.exports = router
