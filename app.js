const express = require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const session=require('express-session');

const MongoDbStore=require('connect-mongodb-session')(session);
const mongoConnect=require('./util/database').mongoConnect;

const productRoutes = require('./routes/product_route');
const cartRoutes=require('./routes/cart_route');
const User = require('./models/user_model');
const authRoutes=require('./routes/auth_route');

const app = express();
const PORT = 8000;

const mongoose=require('mongoose');
const store=new MongoDbStore({
  uri:'mongodb+srv://oshanpandit:oshanpandit123@shoppercluster.ze2e0.mongodb.net/shop?retryWrites=true&w=majority&appName=ShopperCluster',
  collection:'sessions'
});


app.use(bodyParser.urlencoded({extended:false}));
app.use(session({secret:'blah something',resave:false,saveUninitialized:false,store:store}));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));

app.use(express.json());

app.use((req,res,next)=>{
    User.findById('66e691090f70a5067c8ad8f7')
    .then(user=>{
      req.user=user;
      next();
    })
});
app.use('/products',productRoutes);
app.use('/cart',cartRoutes);
app.use('/auth',authRoutes);


mongoose.connect('mongodb+srv://oshanpandit:oshanpandit123@shoppercluster.ze2e0.mongodb.net/shop?retryWrites=true&w=majority&appName=ShopperCluster')
.then(result=>{
  User.findOne().then(user=>{
    if(!user){
      const user=new User({
        name:'Oshan',
        email:'oshan@test.com',
        cart:{
          items:[]
        }
      });
      user.save();
    }
  })
  app.listen(PORT,()=>{
    console.log('The server is up and running on port ',PORT);
  });
})
.catch(error=>{
  console.error(error);
})