const User=require('../models/user_model');
exports.loginUser=async(req,res,next)=>{
    console.log(req.body);
    const user=await User.findById('66e691090f70a5067c8ad8f7');
    req.session.isLoggedIn=true; 
    req.session.user=user;
    res.status(200).json({message:'success'});
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