const express = require('express');
const { body } = require('express-validator');
const { register, login, getUserAlerts } = require('../controllers/auth');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('contact').notEmpty(),
  body('password').isLength({ min: 6 }),
  body('lat').isNumeric(),
  body('lng').isNumeric()
], register);

router.post('/login', login);

router.get('/alerts', auth, getUserAlerts);

module.exports = router;