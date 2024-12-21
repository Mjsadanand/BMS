import mongoose from "mongoose";
const MONGODB_URL = process.env.MONGO_URI || 'mongodb+srv://sadanandjm:Veda%40718@cluster0.y3hoa.mongodb.net/Bill_Board';

const connectToDatabase = async () => {
    try { 
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
    }
};

export  default connectToDatabase ;

