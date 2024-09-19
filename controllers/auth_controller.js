exports.loginUser=async(req,res,next)=>{
    console.log(req.body);
    req.session.isLoggedIn=true; 
    res.status(200).json({message:'success'});
}