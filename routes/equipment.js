const express = require('express');
const router = express.Router();


const {
    getAllEquipment,
    getEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
} = require('../controllers/equipment');
const authUser = require('../middleware/authentication');
const authRoles = require('../middleware/authorizeRoles');


router.route('/')
    .get(getAllEquipment)
    .post(authUser, authRoles('admin', 'staff'), createEquipment);

router.route('/:id')
    .get(getEquipment)
    .patch(authUser, authRoles('admin', 'staff'), updateEquipment)
    .delete(authUser, authRoles('admin', 'staff'), deleteEquipment);

module.exports = router;