const express = require('express');
const path = require('path');
const router = express.Router();

const { login, register } = require('../controllers/auth');
const auth = require('../middleware/authentication');


// Debugging logs
console.log("✅ Auth Routes Loaded");

// Authentication API Routes
router.post('/register', register);
router.post('/login', login);

// Logout Route 
router.post('/logout', (req, res) => {

    req.logout();
    res.status(200).json({ message: 'User logged out successfully. Please remove token on the client-side.' });
});

// Protected Route (Return user info)
router.get('/protected', auth, (req, res) => {
    res.status(200).json({
        message: 'Access granted to protected route.',
        user: req.user, // Ensuring authenticated user info is sent
    });
});

module.exports = router;



