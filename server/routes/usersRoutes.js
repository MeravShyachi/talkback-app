import express from "express";
import { getAll } from "../controllers/userController.js";
import {protect} from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/get-all", protect ,getAll);

export default router;  