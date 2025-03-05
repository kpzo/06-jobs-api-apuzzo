const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

localStorage.setItem('initTime', new Date().toISOString());
localStorage.setItem('user', JSON.stringify({}));
localStorage.setItem('role', 'user');
localStorage.setItem('token', null);
localStorage.setItem('email', null);

module.exports = localStorage;