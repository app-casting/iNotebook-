const mongoose = require('mongoose');

const connectToMogo = async ()=>{
   try {
    await mongoose.connect("mongodb://127.0.0.1:27017/iNotebook", {useNewUrlParser: true, useUnifiedTopology:true})
    
    console.log("MongoDB connected to server sucessfully")
 }
 catch (error){
    console.log("MongoDB connection error:",error)
 }
}
module.exports = connectToMogo
