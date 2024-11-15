const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');

router.route('/')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

router.route('/forgot-pass')
    .post(authController.forgotPass)

router.route('/reset-pass')
    .post(authController.resetPass)

module.exports = router;