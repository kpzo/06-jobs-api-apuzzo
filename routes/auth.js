const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/auth');
const auth = require('../middleware/authentication');


// Authentication API Routes

router.post("/register", register);
router.post("/login", login);



// Logout Route 
const tokenBlacklist = new Set(); // Store invalidated tokens (temporary storage)


router.post('/logout', auth, (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (token) tokenBlacklist.add(token); // Add to blacklist
    res.status(200).json({ message: "Logged out. Token invalidated." });
});

module.exports = router;