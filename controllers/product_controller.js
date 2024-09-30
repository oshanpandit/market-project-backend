const Product=require('../models/product_model');
exports.getAllProducts=async(req,res,next)=>{
     try{
        const productList=await Product.find();
        res.status(200).json(productList);
     }catch(error){
        res.status(500).json({message:'server error'});
     }
}
exports.addProduct=async(req,res,next)=>{
    console.log('session hai',req.session.user);
    const title=req.body.title;
    const price=parseInt(req.body.price);
    const description=req.body.description;
    const category=req.body.category;
    const rating=Math.floor(Math.random() * 5) + 1;
    const product=new Product({
        title:title,
        price:price,
        description:description,
        rating:rating,
        category:category,
        userId:req.session.user._id
    });
    try{
        const response= product.save();
        res.status(201).json(response);
    }catch(error){
        res.status(500).json({message:'server error'},error);
    }
}