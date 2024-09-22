const express=require('express');
const router=express.Router();
const authController=require('../controllers/auth_controller');

router.post('/login',authController.loginUser);
router.get('/check-session',authController.checkSession);
router.get('/logout',authController.logoutUser);
router.post('/signup',authController.userSignUp);

module.exports=router;