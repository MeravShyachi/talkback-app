const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController')
const loginController = require('../controllers/loginController')
const logoutController = require('../controllers/logoutController')


router.post('/signup', signupController.signup)
// router.post('/login', loginController.login)
// router.get('/logout', logoutController.logout)





module.exports = router; 