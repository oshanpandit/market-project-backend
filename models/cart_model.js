const getDb=require('../util/database').getDb;
const  {ObjectId}= require('mongodb');


module.exports=class Cart{
    constructor(obj){
        this.title=obj.title,
        this.price=obj.price,
        this._id= new ObjectId(obj._id);
    }

    async save(){
    const db=getDb();
    const response=await db.collection('cartItems').insertOne(this);
    return response;
  }

    static async getAllCartItems(){
        const db=getDb();
        const data=await db.collection('cartItems').find().toArray();
        return data;
    }

    static async findItem(id){
        const db = getDb();
        const objectId = new ObjectId(id);
        const cartItem = await db.collection('cartItems').findOne({ _id: objectId });
        return cartItem;
    }

    static async deleteCartItem(id) {
        try {
            const db = getDb();

            // Convert id to ObjectId
            const objectId = new ObjectId(id);

            console.log('id hai',id);

            // Use deleteOne to remove the item
            const result = await db.collection('cartItems').deleteOne({ _id: objectId });

            // Return the result of the deletion
            if (result.deletedCount === 1) {
                console.log('Item successfully deleted');
                return { message: 'Item successfully deleted' };
            } else {
                console.log('No item found with that ID');
                return { message: 'No item found with that ID' };
            }

        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }

}