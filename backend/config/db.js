import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect("mongodb+srv://harshsrivastava2502:harsh2502@cluster0.2pldj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("MongoDB connected");
    }catch(error){
        console.log(`ERROR:${error.message}`);
        process.exit(1)
    }
}

export default connectDB;