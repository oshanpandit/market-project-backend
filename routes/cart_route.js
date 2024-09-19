const express=require('express');
const router=express.Router();
const Product=require('../models/product_model');

const cartController=require('../controllers/cart_controller');

router.get('/',cartController.getCartItems);
router.get('/add-item/:_id',cartController.addItemToCart);
router.delete('/:id',cartController.deleteItemFromCart);
router.get('/checkout',cartController.checkoutCart);
router.get('/orders',cartController.getOrders);

module.exports=router;