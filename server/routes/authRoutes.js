import express from "express";
import {protect} from "../middlewares/authMiddleware.js"
import {login, signup, logout, verifyToken, refreshToken} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get("/verify-token", protect, verifyToken);
router.post('/refresh-token', refreshToken);


export default router; 