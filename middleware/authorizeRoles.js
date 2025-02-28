const jwt = require('jsonwebtoken')
const { UnauthenticatedError, BadRequestError } = require('../errors')



const checkRole = (req, res, next) => {
    console.log('authorizeRoles middleware: checking role', req.user)

    
    if (!req.user) {
        console.warn('no user found in request object, attempting to decode token...')
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('auth middleware: no token provided')
            throw new UnauthenticatedError('Authentication invalid')
        }
        try {
            const token = authHeader.split(' ')[1]
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            req.user = { userId: payload.userId, name: payload.name, role: payload.role }
            console.log('authorizeRoles middleware: user recovered from token', req.user)
        } catch (error) {
            console.error('authorizeRoles middleware: token validation failed', error)
            throw new UnauthenticatedError('Authentication invalid')
        }
    }

    if (!req.user.role) {
        console.error('authorizeRoles middleware: user role not found')
        throw new BadRequestError('Forbidden: User Role not found')
    }

    const { role } = req.user

    if (role === 'staff' || role === 'admin') {
        console.log('authorizeRoles middleware: user role is allowed')
        return next()
    } else {
        console.error('access denied. User role:', role)
        throw new BadRequestError('Forbidden: You do not have permission to perform this action')
    }
}

module.exports = checkRole

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