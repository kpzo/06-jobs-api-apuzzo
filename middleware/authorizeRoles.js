const { UnauthenticatedError } = require('../errors');

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new UnauthenticatedError('Authentication required');
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You must be a staff or admin to add equipment' });
        }
        next();
    };
};

module.exports = authorizeRoles;