// ~controllers are functions that control the routes~
// ------------------
// import model
const User = require('../models/User')
const checkRole = require('../middleware/checkRole')
const auth = require('../middleware/authentication')

// import libraries
const { StatusCodes } = require('http-status-codes')

// import error handler
const { BadRequestError } = require('../errors')
const { UnauthenticatedError } = require('../errors')

// register user
const register = async (req, res) => {

    // create user
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    
    // send only name and pw token as response; store in local storage
    res
    .status(StatusCodes.CREATED)
    .json({ user:{ name: user.name }, token })
}


// login user
const login = async (req, res) => {
//initial checking in controller

    const { email, password } = req.body
    
    // check if user exists
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    
    //compare password to hashed password in db
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT()
    res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, token })

}

module.exports = {
    register,
    login,
}

// mongoose middleware needed to de-bloat code in this controller