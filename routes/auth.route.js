const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userExist = require('../middlewares/userExist')
const validateInputs = require('../middlewares/inputValidator')
const { body } = require('express-validator');


router.post('/register',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    ],
    userExist,
    validateInputs,
    authController.register
);
router.post('/login',
    [
        body('email').isEmail().withMessage('Invalid email'),
    ],
    validateInputs,
    userExist,
    authController.login
);
router.get('/verify',
    authController.validate,
);

module.exports = router;
