const mongoose = require("mongoose");
require("dotenv").config(); 

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


module.exports = connectDB