const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require('./connfig/conectDB');
const cookieParser = require('cookie-parser');


connectDB();

const app = express();
require("dotenv").config(); 

app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

app.use('/', require('./routes/users'));
app.use('/', require('./routes/auth'));



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});


