const checkRole = (req, res, next) => {
    const { role } = req.user; // Assuming the user's role is stored in req.user

    if (role === 'staff' || role === 'admin') {
        next(); // Allow access to the next middleware or route handler
    } else {
        res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
    }
};

module.exports = checkRole;