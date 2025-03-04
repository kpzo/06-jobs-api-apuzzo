const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')



const auth = async (req, res, next) => {
    console.log("Received Token:", req.headers.authorization);

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('auth middleware: no token provided')
        return next()
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('decoded token:', decoded)
        req.user = decoded
        next()
    } catch (error) {
        console.error('auth middleware: token validation failed', error)
        throw new UnauthenticatedError('Token Validation Failed')
    }   

    console.log("Decoded Token:", jwt.decode(token));
}




module.exports = { auth }
// module.exports = auth