const express=require('express');
const router=express.Router();
const Product=require('../models/product_model');

const cartController=require('../controllers/cart_controller');

router.get('/',cartController.getCartItems);
router.post('/add-item',cartController.addItemToCart);
router.delete('/:id',cartController.deleteItemFromCart);
router.get('/checkout',cartController.checkoutCart);
router.get('/orders',cartController.getOrders);

module.exports=router;