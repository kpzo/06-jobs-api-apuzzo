const Equipment = require('../models/Equipment')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllEquipment = async (req, res) => {
    // leave createdBy out of find() to allow all users to see all equipment all the time
    const equipment = await Equipment.find({}).populate('createdBy', 'name')
    res.status(StatusCodes.OK).json({ equipment, cout: equipment.length })
}

const getEquipment = async (req, res) => {
    // leave userId out of the variable declaration to allow all users to see each single equipment listing
    const { params: { id:equipmentId } } = req

    const equipment = await Equipment.findOne({ _id: equipmentId, })
    if (!equipment) {
        throw new NotFoundError(`No equipment with id : ${equipmentId}`)
    }
    res.status(StatusCodes.OK).json({ equipment })
}

const createEquipment = async (req, res) => {
    req.body.createdBy = req.user.userId
    const equipment = await Equipment.create(req.body)
    res
        .status(StatusCodes.CREATED)
        .json({ equipment })
}

const updateEquipment = async (req, res) => {
    const {
        body: { status },
        user: { userId },
        params: { id:equipmentId }
    } = req

    if (status === 'pending') {
        throw new BadRequestError('Please locate equipment and update status')
    }
    const equipment = await Equipment.findOneAndUpdate(
        { _id: equipmentId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!equipment) {
        throw new NotFoundError(`No equipment with id : ${equipmentId}`)
    }

    res.status(StatusCodes.OK).json({ equipment})
}

const deleteEquipment = async (req, res) => {
    const { params: { id: equipmentId } } = req

    const equipment = await Equipment.findByIdAndRemove({ _id: equipmentId })

    if (!equipment) {
        throw new NotFoundError(`No equipment with id : ${equipmentId}`)}

    res.status(StatusCodes.OK).send('Item deleted.')
}


module.exports = {
    getAllEquipment,
    getEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
}
