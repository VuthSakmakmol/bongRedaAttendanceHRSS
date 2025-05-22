const express = require('express')
const router = express.Router()
const controller = require('../controllers/employeeController')

router.post('/employees', controller.createEmployee)
router.get('/employees', controller.getAllEmployees)
router.get('/employees/:id', controller.getEmployeeById)
router.put('/employees/:id', controller.updateEmployee)
router.delete('/employees/:id', controller.deleteEmployee)
router.post('/employees/delete-multiple', controller.deleteMultipleEmployees)

module.exports = router
