const playersResponses = {}; // Track play-again responses

const gameSocket =(io, socket) => {

    socket.on("join game", ({roomId, sender}) => {

        const roomSockets = io.sockets.adapter.rooms.get(roomId);
        if (roomSockets && roomSockets.has(socket.id)) {
            console.log(`${sender.username} is already in the room ${roomId}`);
            return;
        }
    
        // Ensure `socket.data.rooms` exists and store room info
        if (!socket.data.rooms) {
            socket.data.rooms = new Set(); // Initialize Set for unique rooms
        }
        
        socket.join(roomId);
        socket.data.rooms.add(roomId); // Track the room
        //console.log(`${sender.username} joined room: ${roomId}`);
    });

    socket.on("roll dice", ({room}) => {
        //console.log("in roll dice");
        socket.to(room).emit("roll dice");
    })

    socket.on("end turn", ({room, selectedTimes, selectedNumber}) => {
        socket.to(room).emit("opponent choice",  {selectedTimes, selectedNumber});
        io.to(room).emit("turn ended");
    });

    socket.on("liar", ({room, opponentDiceArray, times, num}) => {
        socket.to(room).emit("liar", {opponentDiceArray, times, num});
    });

    socket.on("exact", ({room, opponentDiceArray, times, num}) => {
        socket.to(room).emit("exact", {opponentDiceArray, times, num});
    });

    socket.on("set winner", ({room, won}) => {
        if(won){
            //console.log("in you won");
            socket.to(room).emit("you won");
        } else {
            //console.log("in you lost");
            socket.to(room).emit("you lost");
        }
    });

    socket.on("opponent number of dice", ({room, opponentNumDice}) => {
        socket.to(room).emit("opponent number of dice", {num: opponentNumDice});
    })

    socket.on("turn timeout", ({ room, userId }) => {
        io.to(room).emit("turn timeout", { loserId: userId }); // Notify both players
    });
    
    socket.on("game over", ({room}) => {
        socket.to(room).emit("game over");
    })

    socket.on("quit game", ({room, username}) => {
        console.log("in quit game");
        socket.to(room).emit("opponent left", { msg: `Sorry...\n${username} quit the game..\nExiting...`});
    })

    socket.on("play again", ({room, userId}) => {
        if (!playersResponses[room]) {
            playersResponses[room] = {}; // Ensure the room exists in tracking
        }
        playersResponses[room][userId] = true; // Mark this player as ready

        console.log("length: ",Object.keys(playersResponses[room]).length)
        // Check if both players have responded
        if (Object.keys(playersResponses[room]).length === 2) {
            io.to(room).emit("start new game"); // Tell both players to restart
            delete playersResponses[room]; // Reset for next game
        }
    })

    socket.on("leave room", ({room, username}) => {
        console.log(`${username} leave game.`);

        if (socket.data.rooms) {
            socket.data.rooms.delete(room); // Remove only this room
        }

        socket.leave(room); // Leave the room
    })

    socket.on("leave game", ({room}) => {
        socket.to(room).emit("opponent left", { msg: "Your opponent left the game. Exiting..." });
    })

    socket.on("reconnect", () => {
        if (socket.data.rooms) {
            socket.data.rooms.forEach(room => {
                socket.join(room); // Rejoin all rooms they were in
                socket.to(room).emit("player reconnected");
                console.log(`User ${socket.id} rejoined room: ${room} after reconnecting.`);
            });
        }
    });
}

export default gameSocket;