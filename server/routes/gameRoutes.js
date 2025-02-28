import express from "express";
import { getGameState, createGame, updateGameState, deleteGame } from "../controllers/gameController.js";

const router = express.Router();

router.get("/get-game/:roomId", getGameState);
router.post("/create-game", createGame);
router.put("/update-gmae/:roomId", updateGameState);
router.delete("/delete-game/:roomId", deleteGame);

export default router;
