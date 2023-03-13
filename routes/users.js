const express=require('express');
const router =express.Router();
const User = require('../models/user');
const catchAsync=require('../utils/catchAsync');
const passport =require('passport');
const LocalStrategy = require('passport-local');


//CONTROLLER
const usercontrol=require('../controllers/users');

router.route('/register')
    .get(usercontrol.renderRegisterForm)
    .post(catchAsync(usercontrol.userRegistered))


//SERVING A FORM IN GET REQ
router.route('/login')
    .get(usercontrol.showLoginForm)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),usercontrol.confirmLogin)
//TAKING LOGIN REQUEST IN POST REQ
//passport offers functionality
//specify strategy i.e local, we can authenticate using google as well


router.get('/logout', usercontrol.logout);
  


module.exports = router;