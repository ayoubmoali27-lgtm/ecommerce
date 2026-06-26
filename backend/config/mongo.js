const  mongoose = require("mongoose")
const Product = require("../models/product")

const MONGO_URL = "mongodb://ayoub:ayoub123@ac-hhghjf5-shard-00-00.tya4mux.mongodb.net:27017,ac-hhghjf5-shard-00-01.tya4mux.mongodb.net:27017,ac-hhghjf5-shard-00-02.tya4mux.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-ruixj9-shard-0&authSource=admin&appName=Cluster0"


const connectMongo = async ()=>{
    try{
        await mongoose.connect(MONGO_URL)
        console.log("mongodb connected")
    }catch(error){
        console.log(error)
    }
}




module.exports = {connectMongo}