import axiosInstance from "./axiosInstance";
import { apiRequest } from "./apiHelper";

const gameApi = {
    getGameState: (roomId, player) => apiRequest(axiosInstance.get(`/get-game/${roomId}?player=${player}`)),
    createGame: (roomId, player, yourTurn, diceArray) => apiRequest(axiosInstance.post("/create-game", {roomId, player, yourTurn, diceArray, gameStarted: true})),
    updateGameState: (roomId, updatedData) => apiRequest(axiosInstance.put(`/update-gmae/${roomId}`, updatedData)),
    deleteGame: (roomId, player) => axiosInstance.delete(`/delete-game/${roomId}?player=${player}`)
}

export default gameApi;

