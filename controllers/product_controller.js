const Product=require('../models/product_model');
exports.getAllProducts=async(req,res,next)=>{
     try{
        const productList=await Product.getAllProducts();
        res.status(200).json(productList);
     }catch(error){
        res.status(500).json({message:'server error'});
     }
}
exports.addProduct=async(req,res,next)=>{
    try{

        const newProduct= new Product(req);
        const response=await newProduct.save();
        res.status(201).json(response);
    }catch(error){
        res.status(500).json({message:'server error'});
    }
}