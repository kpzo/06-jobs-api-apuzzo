const Equipment = require('../models/Equipment')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllEquipment = async (req, res) => {
    res.send('get all equipment')
}

const getEquipment = async (req, res) => {
    res.send('get single equipment')
}

const createEquipment = async (req, res) => {
    req.body.createdBy = req.user.userId
    const equipment = await Equipment.create(req.body)
    res
        .status(StatusCodes.CREATED)
        .json({ equipment })
}

const updateEquipment = async (req, res) => {
    res.send('update equipment')
}

const deleteEquipment = async (req, res) => {
    res.send('delete equipment')
}

module.exports = {
    getAllEquipment,
    getEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
}