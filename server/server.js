import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/connectDB.js";
import {Server} from "socket.io";
import socketHandler from "./sockets/socketHandler.js";



dotenv.config(); 
connectDB();


const server = http.createServer(app);

const io = new Server(server, {
    cors: '*' //let all the ports access
});

socketHandler(io);


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});


