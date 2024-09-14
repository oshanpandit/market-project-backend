const express = require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const app = express();
const PORT = 8000;

const mongoConnect=require('./util/database').mongoConnect;

const productRoutes = require('./routes/product_route');
const cartRoutes=require('./routes/cart_route');
const User = require('./models/user_model');

const mongoose=require('mongoose');


app.use(bodyParser.urlencoded({extended:false}));

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use((req,res,next)=>{
    User.findById('66e03d9b1a4f3b0717ce3bd7')
    .then(user=>{
      req.user=new User(user.name,user.email,user.cart,user._id);
      next();
    })
});
app.use('/products',productRoutes);
app.use('/cart',cartRoutes);


mongoConnect(()=>{
   app.listen(PORT,()=>{
      console.log('The server is up and running on port',PORT);
   })
})
// mongoose.connect('mongodb+srv://oshanpandit:oshanpandit123@shoppercluster.ze2e0.mongodb.net/shop?retryWrites=true&w=majority&appName=ShopperCluster')
// .then(result=>{
//   app.listen(PORT);
// })
// .catch(error=>{
//   console.error(error);
// })