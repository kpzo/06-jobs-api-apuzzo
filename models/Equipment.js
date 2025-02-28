
const mongoose = require('mongoose')

const EquipmentSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: [true, 'Please provide brand'],
        maxlength: 30
    },
    mount: {
        type: String,
        required: [true, 'Please provide mount type'],
        maxlength: 30
    },
    focalLength: {
        type: String,
        required: [true, 'Please provide focal length'],
        maxlength: 30
    },
    aperture: {
        type: String,
        required: [true, 'Please provide aperture'],
        maxlength: 30
    },
    version: {
        type: String,
        required: [true, 'Please provide model version'],
        maxlength: 30
    },
    status: {
        type: String,
        enum: ['available', 'in use', 'retired', 'reserved', 'pending'],
        default: 'pending'
    },
    serialNumber: {
        type: String,
        required: [true, 'Please provide a serial number'],
        maxlength: 30,
        unique: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide creator']
    }
}, 
{ timestamps: true}
)

module.exports = mongoose.model('Equipment', EquipmentSchema)