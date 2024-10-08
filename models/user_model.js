const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
      type:String,
    },
    email:{
      type:String,
      required:true
    },
    password:{
      type:String,
      required:true
    },
    cart:{
      items:[
        {
          productId:{type:Schema.Types.ObjectId,ref:'Product',required:true},
          quantity:{type:Number,required:true}
        }
      ]
    }
});

userSchema.methods.addToCart=async function(productId){
   const cartProductIndex = this.cart.items.findIndex(cartItem => 
               cartItem.productId.toString()==productId.toString());
            
            const updatedCartItems=[...this.cart.items];
            
            let initialQuantity=1;
            
            if(cartProductIndex>=0){
               const newQuantity=updatedCartItems[cartProductIndex].quantity+1;
               updatedCartItems[cartProductIndex].quantity=newQuantity;
            }else{
               updatedCartItems.push({productId:productId,quantity:initialQuantity});
            }
            const updatedCart={
               items:updatedCartItems
            }

            this.cart=updatedCart;
            const response=await this.save();
            return response;
}

userSchema.methods.deleteItemFromCart=async function(productId){
   const index = this.cart.items.findIndex(item => {
       return item.productId==productId;
    });

    if (index === -1) {
      return { message: 'Product not found in cart' };
     }
        
            let updatedCartItems = [...this.cart.items];
        
            if (this.cart.items[index].quantity === 1) {
                updatedCartItems = updatedCartItems.filter(item => item.productId.toString()!==productId.toString());
            } else {
                updatedCartItems[index].quantity--;
            }
            const updatedCart = {
                items: updatedCartItems
            };

            this.cart=updatedCart;
            const response=await this.save();
            console.log(response);
            return response;
}

userSchema.methods.clearCart=async function(){
     this.cart={items:[]};
     return this.save();
}

module.exports=mongoose.model('User',userSchema);
// const getDb=require('../util/database').getDb;
// const  {ObjectId}= require('mongodb');

// module.exports=class User{

//      constructor(username,email,cart,id){
//         this.name=username;
//         this.email=email;
//         this.cart=cart; //{items:[]}
//         this._id=id;
//      }

//      async save(){
//         const db=getDb();
//         const response=await db.collection('users').insertOne(this);
//         return response;
//      }

//      async addToCart(product){
      
//       const cartProductIndex = this.cart.items.findIndex(cartItem => 
//          cartItem.productId.equals(new ObjectId(product._id))
//      );
      
//       const updatedCartItems=[...this.cart.items];
      
//       let initialQuantity=1;
      
//       if(cartProductIndex>=0){
//          const newQuantity=updatedCartItems[cartProductIndex].quantity+1;
//          updatedCartItems[cartProductIndex].quantity=newQuantity;
//       }else{
//          updatedCartItems.push({productId:new ObjectId(product._id),quantity:initialQuantity});
//       }
//       const updatedCart={
//          items:updatedCartItems
//       }
      
//       const db=getDb();
//       const response=await db.collection('users').updateOne({_id:new ObjectId(this._id)},
//       {$set:{cart:updatedCart}});
      
//       return response;
//    }

//    async deleteItemFromCart(productId) {
//       const index = this.cart.items.findIndex(item => {
//           return item.productId.toString() === productId.toString();
//       });
//       if (index === -1) {
//           return { message: 'Product not found in cart' };
//       }
  
//       let updatedCartItems = [...this.cart.items];
  
//       if (this.cart.items[index].quantity === 1) {
//           updatedCartItems = updatedCartItems.filter(item => item.productId.toString() !== productId.toString());
//       } else {
//           updatedCartItems[index].quantity--;
//       }
//       const updatedCart = {
//           items: updatedCartItems
//       };
  
//       const db = getDb();
//       const response = await db.collection('users').updateOne(
//           { _id: new ObjectId(this._id) },
//           { $set: { cart: updatedCart } }
//       );
  
//       return response;
//   }


//    async addOrder(){
//       const db=getDb();
//       return this.getAllCartItems()
//       .then(products=>{
//          const order={
//             items:products,
//             user:{
//                _id:new ObjectId(this._id),
//                name:this.name
//             }
//          }
//          return db.collection('orders').insertOne(order)
//       })
//       .then(result=>{
//            this.cart={items:[]};
//            return db.collection('users')
//           .updateOne(
//          {_id:new ObjectId(this._id)},
//          {$set:{cart:{items:[]}}}
//         );
//       });
//    }

//    async getOrders(){
//       const db=getDb();
//       const response=await db.collection('orders').find({'user._id':new ObjectId(this._id)}).toArray();
//       return response;
//    }
  

//     async getAllCartItems(){
//          const db=getDb();
//          const productIds=this.cart.items.map(i => {
//             return i.productId
//          });
//          return db.collection('products')
//          .find({_id:{$in:productIds}})
//          .toArray()
//          .then(products=>{
//             return products.map(p=>{
//                return{
//                   ...p,
//                   quantity:this.cart.items.find(i=>{
//                      return i.productId.toString()===p._id.toString();
//                   }).quantity
//                };
//             });
//          });
//     }

//      static async findById(userId){
//         const db=getDb();
//         const objectId=new ObjectId(userId);
//         const response=await db.collection('users').findOne({_id:objectId});
//         return response;
//      } 

// }