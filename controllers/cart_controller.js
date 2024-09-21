const Product=require('../models/product_model');
const Order=require('../models/order_model');
const User=require('../models/user_model');

exports.getCartItems=async(req,res,next)=>{

    try{
      const currentUser=await User.findById(req.session.user._id);
      await currentUser.populate('cart.items.productId');
      const cartList = currentUser.cart.items;
      res.status(200).json(cartList);
      }catch(error){
         console.log(error);
         res.status(500).json({message:'server error'});
      }
}

exports.addItemToCart=async(req,res,next)=>{
    const productId=req.params._id;
    try{
       const currentUser=await User.findById(req.session.user._id);
       const response=await currentUser.addToCart(productId);
       res.status(201).json(response);
    }catch(error){
       console.log(error);
       res.status(500).json({message:'server error'});
    }
}

exports.deleteItemFromCart=async(req,res,next)=>{
    const id = req.params.id;
    try {
       const currentUser=await User.findById(req.session.user._id);
       const result = await currentUser.deleteItemFromCart(id);
       res.status(200).json(result);
    } catch (error) {
       res.status(500).json({ message: 'Server error', error });
   }
}

exports.checkoutCart=async(req,res,next)=>{
   const currentUser=await User.findById(req.session.user._id);
   await currentUser.populate('cart.items.productId');
   const productList=currentUser.cart.items.map(i=>{
      return {quantity:i.quantity,productData:{...i.productId._doc}};
   });
   const order=new Order({
      user:{
         name:currentUser.name,
         userId:currentUser
      },
      products:productList
   });
   try{
      const response=await order.save();
      currentUser.clearCart();
      res.status(200).json(response);
   }catch(error){
      console.log(error);
      res.status(500).json({message:"Server Error",error});
   }
}

exports.getOrders=async(req,res,next)=>{
   try{
      const currentUser=await User.findById(req.session.user._id);
      const orderList=await Order.find({'user.userId':currentUser._id});
      res.status(200).json(orderList);
   }catch(error){
      res.status(500).json({message:"Server Error"});
   }
}