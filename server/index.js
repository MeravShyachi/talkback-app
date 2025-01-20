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

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true // Allow cookies
}));


import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';

app.use('/', userRoutes);
app.use('/', authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: '*' //let all the ports access
});



io.on('connection', (socket) => {

})






mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});


