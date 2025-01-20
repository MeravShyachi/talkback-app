import express from "express";
import {signup} from '../controllers/signupController.js';
import {login} from '../controllers/loginController.js';
import {logout} from '../controllers/logoutController.js';
import { verifyToken } from "../middleware/JWT.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/auth', verifyToken);


export default router; 