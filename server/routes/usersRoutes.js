import express from "express";
import { getAll, getUser } from "../controllers/userController.js";
import {protect} from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/get-all", protect ,getAll);
router.get("/get-user", protect, getUser,);

export default router;  