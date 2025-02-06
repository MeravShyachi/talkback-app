import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from './routes/usersRoutes.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js'

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true // Allow cookies
}));

app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', messageRoutes);


export default app;