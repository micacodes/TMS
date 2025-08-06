const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

//Authentication routes are defined here
//register
router.post(
  '/register',
  [
    body('fullName', 'Full name is required').not().isEmpty().trim().escape(),
    body('username', 'Username is required').not().isEmpty().trim().escape(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
  ],
  authController.register
);

// login
router.post(
  '/login',
  [
    body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').exists(),
  ],
  authController.login
);

//logout
router.post('/logout', authController.logout);

module.exports = router;