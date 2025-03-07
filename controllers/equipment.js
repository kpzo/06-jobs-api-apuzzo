const Equipment = require('../models/Equipment');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find({}).populate('createdBy', 'name');
        const responseData = Array.isArray(equipment) ? equipment : [equipment];
        if (responseData.length < 1) {
            throw new NotFoundError('No equipment found');
        }
        res.status(StatusCodes.OK).json({ responseData, count: responseData.length });
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

const createEquipment = async (req, res, next) => {

    try {
        console.log('Checking req.user in createEquipment:', req.user);

        if (!req.user) {
            throw new BadRequestError('Please login to add equipment');
        }

        if (!req.user || !req.user.userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Please login to add equipment" });
        }
        req.body.createdBy = req.user.userId;        
        
        const newEquipment = await Equipment.create(req.body);

        res.status(StatusCodes.CREATED).json({ equipment: [newEquipment] });
    } catch (error) {
        console.error("Error in createEquipment:", error);

        // Forward error to error middleware
        next(error);
    }
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
    createEquipment,
    updateEquipment,
    deleteEquipment,
};