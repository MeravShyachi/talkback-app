import mongoose from "mongoose";
import dotenv from "dotenv"; // Use `import` instead of `require`

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true, // Use the new connection management engine for improved monitoring and stability.
            useNewUrlParser: true // Use the new connection string parser for better compatibility.
        });
    } catch (err) {
        console.error(err);
    }
}


export default connectDB;