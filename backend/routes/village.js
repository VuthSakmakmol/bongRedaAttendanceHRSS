const express = require('express');
const router = express.Router();
const villageController = require('../controllers/villageController');

router.post('/', villageController.createVillage);
router.get('/', villageController.getVillages);
router.put('/:id', villageController.updateVillage);
router.delete('/:id', villageController.deleteVillage);

module.exports = router;
