// user info stored in mongoose
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const UserSchema = new mongoose.Schema({
    id:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true, 'Please provide a creator'],
    },
    name:{
        type:String,
        required:[true, 'Please provide a name'],
        minlength:3,
        maxlength:50,
    },
    email:{
        type:String,
        required:[true, 'Please provide an email'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
    unique:true,
    },
    password:{
        type:String,
        required:[true, 'Please provide a password'],
        minlength:6,
    },
    role:{
        type:String,
        enum:['user', 'staff', 'admin'],
        default:'user',
    },
})

// using "async function" so the schema referrs to OUR document (for commands like 'this.' etc) to gather specific user data from our db to hash the passwords before saving 
UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// once again use 'function' to refer to our document for specific user data
UserSchema.methods.createJWT = function() {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

UserSchema.methods.comparePassword = async function(providedPassword) {
    const isMatch = await bcrypt.compare(providedPassword, this.password)
    return isMatch
}

// to keep logic in all place (UserSchema) - generate token using instance method instead of having it in the controller

module.exports = mongoose.model('User', UserSchema)