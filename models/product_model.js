const getDb=require('../util/database').getDb;

module.exports=class Product{
    constructor(req){
        const obj=req.body;
        this.title=obj.title;
        this.description=obj.description;
        this.price=obj.price;
        this.rating=Math.floor(Math.random() * 5) + 1;
        this.userId=req.user._id;
     }

     async save(){
        const db=getDb();
        const response=await db.collection('products').insertOne(this);
        console.log(response,this.userId);
        return response;
     }

     static async getAllProducts(){
         const db=getDb();
         const data=await db.collection('products').find().toArray();
        //  console.log(data);
         return data;
     }

      static async findItem(id){
         const db = getDb();
         const productId=id;
         const product = await db.collection('products').findOne({ _id:productId});
         if(product){
            return product;
         }else{
            return null;
         }
     }

}