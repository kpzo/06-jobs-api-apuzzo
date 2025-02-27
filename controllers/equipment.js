const Equipment = require('../models/Equipment');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const authorizeRoles = require('../middleware/authorizeRoles');
const auth = require('../middleware/authentication');

const getAllEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find({}).populate('createdBy', 'name');
        res.status(StatusCodes.OK).json({ equipment, count: equipment.length });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching equipment' });
    }
};

const getEquipment = async (req, res) => {
    const { params: { id: equipmentId } } = req;

    const equipment = await Equipment.findOne({ _id: equipmentId });
    if (!equipment) {
        throw new NotFoundError(`No equipment with id : ${equipmentId}`);
    }
    res.status(StatusCodes.OK).json({ equipment });
};

const createEquipment = async (req, res) => {
    req.body.createdBy = req.user.userId;
    if (!req.user) {
        throw new BadRequestError('Please login to add equipment');
    }
    const equipment = await Equipment.create(req.body);
    res.status(StatusCodes.CREATED).json({ equipment });
};

const updateEquipment = async (req, res) => {
    const {
        body: { status },
        user: { _id: userId },
        params: { id: equipmentId }
    } = req;

    if (status === 'pending') {
        throw new BadRequestError('Please locate equipment and update status');
    }
    

    req.body.updatedBy = userId;

    const equipment = await Equipment.findOneAndUpdate(
        { _id: equipmentId },
        req.body,
        { new: true, runValidators: true }
    );
    if (!equipment) {
        throw new NotFoundError(`No equipment with id : ${equipmentId}`);
    }

    res.status(StatusCodes.OK).json({ equipment });
};

const deleteEquipment = async (req, res) => {
    const { params: { id: equipmentId } } = req;

    const equipment = await Equipment.findByIdAndRemove({ _id: equipmentId });

    if (!equipment) {
        throw new NotFoundError(`No equipment with id : ${equipmentId}`);
    }

    res.status(StatusCodes.OK).send('Item deleted.');
};

module.exports = {
    getAllEquipment,
    getEquipment,
    createEquipment: [authorizeRoles('admin', 'staff'), createEquipment],
    updateEquipment: [authorizeRoles('admin', 'staff'), updateEquipment],
    deleteEquipment: [authorizeRoles('admin', 'staff'), deleteEquipment],
};