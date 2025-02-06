import express from "express";
import {protect} from "../middlewares/authMiddleware.js"
import {getAll, addMessage} from '../controllers/messageController.js';

const router = express.Router();

router.post('/get-messages',protect, getAll);
router.post('/add-message',protect, addMessage);

export default router; 