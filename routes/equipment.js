const express = require('express');
const router = express.Router();


const {
    getAllEquipment,
    getEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
} = require('../controllers/equipment');

const auth = require('../middleware/authentication');
const checkRole = require('../middleware/authorizeRoles');


router.route('/')
    .get(getAllEquipment)
    .post(auth, checkRole, createEquipment);

router.route('/:id')
    .get(getEquipment)
    .patch(auth, checkRole, updateEquipment)
    .delete(auth, checkRole, deleteEquipment)
    .put(auth, checkRole, updateEquipment);

module.exports = router;