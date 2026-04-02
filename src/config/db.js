import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const connectDB  = async()=>{
    try {
        await mongoose.connect(process.env.Mongo_URI);
        console.log("mongodb is connected!!");
        
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}

export default connectDB