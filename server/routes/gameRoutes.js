import express from "express";
import { getGameState, createGame, updateGameState, deleteGame } from "../controllers/gameController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/get-game/:roomId", protect, getGameState);
router.post("/create-game", protect, createGame);
router.put("/update-gmae/:roomId", protect, updateGameState);
router.delete("/delete-game/:roomId", protect, deleteGame);

export default router;
