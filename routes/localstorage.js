const express = require('express');
const localStorage = require('../localstorage');

const router = express.Router();

router.get('/save', (req, res) => {
    localStorage.setItem('userSession', JSON.stringify({ username: 'JohnDoe' }));
    res.send('User session saved!');
});

router.get('/load', (req, res) => {
    const userSession = localStorage.getItem('userSession');
    res.send(userSession ? `Loaded session: ${userSession}` : 'No session found');
});

module.exports = router;
