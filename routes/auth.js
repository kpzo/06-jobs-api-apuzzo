const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');
const auth = require('../middleware/authentication');
const checkRole = require('../middleware/checkRole');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, (req, res) => {
  res.send('This is a protected route');
});


module.exports = router;