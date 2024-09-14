const Product=require('../models/product_model');

exports.getCartItems=async(req,res,next)=>{
    try{
        const cartList=await req.user.getAllCartItems();
        res.status(200).json(cartList);
      }catch(error){
        res.status(500).json({message:'server error'});
      }
}

exports.addItemToCart=async(req,res,next)=>{
    const product=req.body;
    try{
       const response=await req.user.addToCart(product);
       res.status(201).json(response);
    }catch(error){
       console.log(error);
       res.status(500).json({message:'server error'});
    }
}

exports.deleteItemFromCart=async(req,res,next)=>{
    const id = req.params.id;
    try {
       const result = await req.user.deleteItemFromCart(id);
       res.status(200).json(result);
    } catch (error) {
       res.status(500).json({ message: 'Server error', error });
   }
}

exports.checkoutCart=async(req,res,next)=>{
   try{
      const response=await req.user.addOrder();
      res.status(200).json(response);
   }catch(error){
      res.status(500).json({message:"Server Error",error});
   }
}

exports.getOrders=async(req,res,next)=>{
   try{
      const response=await req.user.getOrders();
      res.status(200).json(response);
   }catch(error){
      res.status(500).json({message:"Server Error"});
   }
}