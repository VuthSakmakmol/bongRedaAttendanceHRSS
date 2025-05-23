const express = require('express')
const router = express.Router()
const attendanceController = require('../controllers/attendanceController')

router.post('/import', attendanceController.bulkImport)
router.get('/', attendanceController.getAttendance)

module.exports = router
