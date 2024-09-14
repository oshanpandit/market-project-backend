const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;

let _db;

const mongoConnect=(callback)=>{
MongoClient.connect('mongodb+srv://oshanpandit:oshanpandit123@shoppercluster.ze2e0.mongodb.net/shop?retryWrites=true&w=majority&appName=ShopperCluster')
.then(client=>{
    console.log('Database Connected!');
    _db=client.db();
    callback();
})
.catch(error=>{
    console.log('An error occured while connecting the database ',error);
    throw error;
});
}

const getDb=()=>{
   if(_db){
    return _db;
   }
    throw 'No Database Found';
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;



