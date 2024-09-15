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
    const title=req.body.title;
    const price=parseInt(req.body.price);
    const description=req.body.description;
    const rating=Math.floor(Math.random() * 5) + 1;
    const product=new Product({
        title:title,
        price:price,
        description:description,
        rating:rating,
        userId:req.user
    });
    try{
        const response= product.save();
        console.log('created product');
        res.status(201).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json({message:'server error'},error);
    }
}