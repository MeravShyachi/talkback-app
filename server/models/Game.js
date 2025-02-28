import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    roomId: { type: String, required: true }, // Room ID
    player: { type: String , required: true }, // Player ID
    numDice: { type: Number, default: 5 }, // Player's dice count
    opponentNumDice: { type: Number, default: 5 }, // Opponent's dice count
    yourTurn: { type: Boolean, default: false }, // Player ID whose turn it is
    opponentTimes: { type: Number, default: null }, // Last bet times
    opponentNumber: { type: Number, default: null }, // Last bet number
    diceArray: { type: [Number], default: [1, 1, 1, 1, 1] }, // Current dice values
    gameStarted: { type: Boolean, default: false }, // Whether the game has started
    turnTimer: { type: Number, default: 40 }, // Timer for turns
    showGameOverPopup: { type: String, default: null },
    isWaiting: { type: String, default: null },
    lastUpdated: { type: Date, default: Date.now }, // Last update timestamp
});

export default mongoose.model("Game", gameSchema);
