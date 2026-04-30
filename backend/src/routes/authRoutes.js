const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { registerValidation, loginValidation, runValidation } = require('../middleware/validators');

const router = express.Router();

router.post('/register', registerValidation, runValidation, register);
router.post('/login', loginValidation, runValidation, login);
router.get('/me', authMiddleware, getProfile);

module.exports = router;
