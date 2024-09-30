const Product=require('../models/product_model');
const Order=require('../models/order_model');
const User=require('../models/user_model');
const nodemailer=require('nodemailer');
const transporter=require('../util/mail-transporter');

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
      const totalAmount = order.products.reduce((acc, item) => acc + (item.quantity * item.productData.price), 0);

  // Generate product list HTML
  const productListHTML = order.products.map(item => `
    <li>
      <strong>${item.productData.title}</strong> (x${item.quantity}) - $${item.productData.price}
    </li>
  `).join('');

  const mailOptions = {
    from: 'Support@shopper.com',           
    to: currentUser.email,      
    subject: 'Order Placed!',                  
    html: `
      <h1>Order Confirmation</h1>
      <p>Dear ${currentUser.name},</p>
      <p>Thank you for your order! Your order has been successfully placed and will reach you in 3-4 days.</p>
      
      <h2>Order Details:</h2>
      <ul>
        <li><strong>Order ID:</strong> ${order._id}</li>
        <li><strong>Items:</strong></li>
        <ul>
          ${productListHTML}
        </ul>
        <li><strong>Total Amount:</strong> $${totalAmount}</li>
      </ul>
      
      <p>We hope you enjoy your purchase. If you have any questions, feel free to contact our support team.</p>
      <p>Best Regards,<br>Shopper Inc</p>
    ` 
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

   return res.status(200).json(response);
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