const express = require('express');
var router = express.Router();
const con = require('../../database/connection');
const handler = require('./user.controller');
const validation = require('./user.validation')
const auth = require('./user.authentication');
const path = require("path")

/*----------Login and SingUp API----------------*/

router.post('/signup', validation.signup, handler.signup);  
router.post('/login', validation.login,handler.login);  
router.put('/forgot/password', handler.forgotPassword);
router.put('/reset/password', handler.resetPassword);
router.put('/change/password',auth.verifyToken,handler.changePassword);
router.get('/profile',auth.verifyToken,handler.userProfile);


module.exports = router;