const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require('./connfig/conectDB');
//const bodyParser = require('body-parser');

connectDB();

const app = express();
require("dotenv").config(); 

app.use(cors());
app.use(express.json());

app.use('/', require('./routes/users'))
app.use('/', require('./routes/auth'))



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});


