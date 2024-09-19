const Product=require('../models/product_model');
const Order=require('../models/order_model');
exports.getCartItems=async(req,res,next)=>{

    try{
      await req.user.populate('cart.items.productId');
      const cartList = req.user.cart.items;
      res.status(200).json(cartList);
      }catch(error){
         console.log(error);
         res.status(500).json({message:'server error'});
      }
}

exports.addItemToCart=async(req,res,next)=>{
    const productId=req.params._id;
    try{
       const response=await req.user.addToCart(productId);
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
   await req.user.populate('cart.items.productId');
   const productList=req.user.cart.items.map(i=>{
      return {quantity:i.quantity,productData:{...i.productId._doc}};
   });
   const order=new Order({
      user:{
         name:req.user.name,
         userId:req.user
      },
      products:productList
   });
   try{
      const response=await order.save();
      req.user.clearCart();
      res.status(200).json(response);
   }catch(error){
      console.log(error);
      res.status(500).json({message:"Server Error",error});
   }
}

exports.getOrders=async(req,res,next)=>{
   try{
      const orderList=await Order.find({'user.userId':req.user._id});
      res.status(200).json(orderList);
   }catch(error){
      res.status(500).json({message:"Server Error"});
   }
}