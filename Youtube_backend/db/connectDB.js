import mongoose from "mongoose";
import  {MONGO_NAME}  from "../constants.js";

let  connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${MONGO_NAME}`);
        console.log("Database connected");
    } catch (error) {
        console.log(error);        
    }
};

export default connectDB