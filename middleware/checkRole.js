
const { BadRequestError } = require("../errors");

const checkRole = (req, res, next) => {
    const { user } = req;
    if (!user || !user.role) {
        return new BadRequestError('User role is not defined');
    }

    const { role } = user.role;

    if (role === 'staff' || role === 'admin') {
        return next(); // Allow access to the next middleware or route handler
    } else {
        return new BadRequestError('Forbidden: You do not have permission to perform this action');
    }
};

module.exports = checkRole