const express = require('express');

const AuthController = require('../controllers/auth.controller');
const AuthValidator = require('../services/validation/auth.validator');

const router = express.Router();

router.post('/sign-up', AuthValidator.signUp, AuthController.signUp);
router.post('/login', AuthValidator.signIn, AuthController.login);

module.exports = router;
