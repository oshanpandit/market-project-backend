const express=require('express');
const router=express.Router();
const authController=require('../controllers/auth_controller');

router.post('/login',authController.loginUser);

module.exports=router;