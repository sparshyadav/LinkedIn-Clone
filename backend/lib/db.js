import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.Mongo_URI);
        console.log(`MongoDB Connected: ${error.message}`);
    }
    catch (error) {
        console.error(`Error Connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};