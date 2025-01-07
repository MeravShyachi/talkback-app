const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require('./connfig/conectDB');

connectDB();

const app = express();
require("dotenv").config(); 

app.use(cors());
app.use(express.json());

const people = [
    { id: 1, name: "Alice", isOnline: true },
    { id: 2, name: "Bob", isOnline: true},
    { id: 3, name: "Charlie", isOnline: true },
    { id: 4, name: "David", isOnline: false },
];

app.get("/people", (req, res)=>{
    res.send(people);
})


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});


