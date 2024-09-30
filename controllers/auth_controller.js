const User=require('../models/user_model');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const transporter=require('../util/mail-transporter');
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
       return res.status(400).json({message:'Email/Password wrong'});
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
      return res.status(409).json({message:'user already exists'});
     }else{
        const hashedPassword=await bcrypt.hash(password,12);
        const user=new User({
        email:email,
        name:username,
        password:hashedPassword,
        cart:{items:[]}
      });
      const resp=await user.save();
  
      const mailOptions = {
        from: 'Support@shopper.com',           
        to: user.email,      
        subject: 'User SignUp Information ',                  
        text: "Dear Customer, \n\nThank you for signing up with Shopper App! Your account has been successfully created. We are thrilled to have you as part of our community. \n\nFeel free to explore the features and enjoy seamless shopping with us.\n\nIf you have any questions, do not hesitate to contact our support team.\n\nBest regards,\nShopper Support Team",
        html: `
          <h2>Welcome to Shopper App!</h2>
          <p>Dear Customer,</p>
          <p>Thank you for joining the Shopper community! Your account has been successfully created, and we are excited to have you onboard.</p>
          <p>You can now explore all the features and start shopping effortlessly with our app.</p>
          <p>If you have any questions or need assistance, feel free to reach out to our support team anytime.</p>
          <p>Best regards,</p>
          <p><strong>Shopper Support Team</strong></p>
        `
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      
      console.log(resp);
      return res.status(201).json({message:'success'});
     }
}