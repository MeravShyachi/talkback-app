import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import {Server} from "socket.io";

dotenv.config(); 
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: '*' //let all the ports access
})

io.on('connection', (socket) => {
    console.log("user connected");
})



app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';

app.use('/', userRoutes);
app.use('/', authRoutes);



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});


