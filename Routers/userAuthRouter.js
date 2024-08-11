const express = require('express');
const router = express.Router();
const authFunction = require('../DB/auth.js');

// Регистрация
// Можно сделать возможность регистрации по определённому токену-приглашению
router.post('/register', authFunction.register);
// Авторизация
router.post('/login', authFunction.login);

module.exports = router;
