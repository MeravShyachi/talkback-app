import Game from "../models/Game.js";

// Create a New Game
export const createGame = async (req, res) => {
    try {
        const updatedGame = await Game.findOneAndUpdate(
            { roomId: req.body.roomId, player: req.body.player },  // Find game by room and player
            { $set: req.body},
            { new: true, upsert: true } // Return updated document, create if not found
        );
        res.status(201).json(updatedGame);
    } catch (error) {
        console.error("Error creating or updating game:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Update Game State (e.g., Turn Change)
export const updateGameState = async (req, res) => {
    try {
        const updatedGame = await Game.findOneAndUpdate(
            { roomId: req.params.roomId, player: req.body.player},
            { $set: req.body },
            { new: true }
        );
        res.json(updatedGame);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Get Game State (For Rejoining After Refresh)
export const getGameState = async (req, res) => {
    try {
        const game = await Game.findOne({ roomId: req.params.roomId, player: req.query.player});
        if (!game) return res.status(404).json({ message: "Game not found" });
        res.json(game);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};


// ✅ Delete Game (When Game Over)
export const deleteGame = async (req, res) => {
    try {
        // await Game.findOneAndDelete({ roomId: req.params.roomId, player: req.query.player });
        await Game.deleteMany({ roomId: req.params.roomId });
        res.json({ message: "Game deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};