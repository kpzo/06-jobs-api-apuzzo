const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
    console.log('auth middleware: checking authentication')

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('auth middleware: no token provided')
        return next()
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            id: payload.id || payload.userId,
            name: payload.name,
            role: payload.role || 'user'
        }
        console.log('auth middleware: user authenticated', req.user)
        next()
    } catch (error) {
        console.error('auth middleware: token validation failed', error)
        throw new UnauthenticatedError('Token Validation Failed')
    }   
}

module.exports = auth

// const auth = async (req, res, next) => {
//     // check header
//     console.log('auth middleware: checking authentication')
//     const authHeader = req.headers.authorization
//     if(!authHeader || !authHeader.startsWith('Bearer ')){
//         console.error('auth middleware: no token provided')
//         throw new UnauthenticatedError('Authentication invalid')
//     }
//     const token = authHeader.split(' ')[1]

//     try {
//         const payload = jwt.verify(token, process.env.JWT_SECRET)
//         // attach the user to the request object (equipment)
//         req.user = { userId: payload.userId, name: payload.name, role: payload.role }
//         console.log('auth middleware: user authenticated', req.user)
//         next()
//     } catch (error) {
//         console.error('auth middleware: token validation failed', error)
//         throw new UnauthenticatedError('Authentication invalid')
//     }

// }

// module.exports = auth