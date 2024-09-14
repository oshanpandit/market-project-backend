const express=require('express');
const router=express.Router();

const productController=require('../controllers/product_controller');

router.get('/',productController.getAllProducts);
router.post('/add-product',productController.addProduct);

module.exports=router;
