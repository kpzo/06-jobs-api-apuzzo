const express = require('express');
const router = express.Router();


const {
    getAllEquipment,
    getEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
} = require('../controllers/equipment');
const authenticateUser = require('../middleware/authentication');
const authorizeRoles = require('../middleware/authorizeRoles');


router.route('/')
    .get(getAllEquipment)
    .post(authenticateUser, authorizeRoles('admin', 'staff'), createEquipment);

router.route('/:id')
    .get(getEquipment)
    .patch(authenticateUser, authorizeRoles('admin', 'staff'), updateEquipment)
    .delete(authenticateUser, authorizeRoles('admin', 'staff'), deleteEquipment);

module.exports = router;