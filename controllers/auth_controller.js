const User=require('../models/user_model');
const bcrypt=require('bcryptjs');
exports.loginUser=async(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
  try{
    const user=await User.findOne({email:email});
    if(!user){
       return res.status(404).json({message:'User not found'});
    }
    const passwordMatch=await bcrypt.compare(password,user.password);
    if(passwordMatch==false){
       return res.status(400).json({message:'Email/password wrong'});
    }
    req.session.isLoggedIn=true; 
    req.session.user=user;
    return res.status(200).json({message:'success'});
  }catch(error){
    console.error('Error during login',error);
    return res.status(500).json({message:'server error'});
  }
}

exports.checkSession=async(req,res,next)=>{
    if(req.session.isLoggedIn){
        res.status(200).json({isLoggedIn:true});
    }else{
        res.status(404).json({isLoggedIn:false});
    }
}
exports.logoutUser=async(req,res,next)=>{
     req.session.destroy(()=>{
        res.status(200).json({message:'success'});
     });
}
exports.userSignUp=async(req,res,next)=>{
     const email=req.body.email;
     const password=req.body.password;
     const confirmPassword=req.body.confirmPassword;
     const username=req.body.username;
     const response=await User.findOne({email:email});

     if(response){
      res.status(409).json({message:'user already exists'});
     }else{
        const hashedPassword=await bcrypt.hash(password,12);
        const user=new User({
        email:email,
        name:username,
        password:hashedPassword,
        cart:{items:[]}
      });
      const resp=await user.save();
      console.log(resp);
      res.status(201).json({message:'success'});
     }
}