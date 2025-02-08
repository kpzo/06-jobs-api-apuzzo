const express = require('express')
const router = express.Router()

const { 
    getAllEquipment,
    getEquipment,
    updateEquipment,
    createEquipment,
    deleteEquipment, } = require('../controllers/equipment')

router.route('/')
    .post(createEquipment)
    .get(getAllEquipment)

router.route('/:id')
    .get(getEquipment)
    .delete(deleteEquipment)
    .put(updateEquipment)

module.exports = router