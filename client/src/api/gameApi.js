import axiosInstance from "./axiosInstance";

// Create a new game
export const createGame = async (roomId, player, yourTurn, diceArray) => {
    try {
        const response = await axiosInstance.post("/create-game", {roomId, player, yourTurn, diceArray, gameStarted: true});
        return response.data;
    } catch (error) {
        console.error("Error creating game:", error);
        return { error: error.response.data.message };
    }
};

// Update game state (e.g., turn update, dice roll)
export const updateGameState = async (roomId, updatedData) => {
    try {
        const response = await axiosInstance.put(`/update-gmae/${roomId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Error updating game state:", error);
        return { error: error.response.data.message };
        // return null;
    }
};

// Fetch game state when rejoining
export const getGameState = async (roomId, player) => {
    try {
        const response = await axiosInstance.get(`/get-game/${roomId}?player=${player}`);
        return response.data;
    } catch (error) {
        if(error.status === 404){
            console.log(error.response.data.message);
            return { notExists: true }
        }
        console.error("Error fetching game state:", error);
        return { error: error.response.data.message };
    }
};

// Delete game (when game over)
export const deleteGame = async (roomId, player) => {
    try {
        await axiosInstance.delete(`/delete-game/${roomId}?player=${player}`);
    } catch (error) {
        console.error("Error deleting game:", error);
    }
};
