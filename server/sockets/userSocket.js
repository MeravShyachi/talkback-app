const userSocket = (io, socket) => {
    
    const emitConnectedUsers = async () => {
        const sockets = await io.fetchSockets();
        const connectedUsers = sockets
            .map(s => s.data.userId)
            .filter(userId => userId); // Ensure no undefined values
        io.emit("connected users", connectedUsers); // Emit to all clients
    };

    const getReceiverSocket = async (receiverId) => {
        const sockets = await io.fetchSockets();
        const receiverSocket = sockets.find(socket => socket.data.userId === receiverId);

        return receiverSocket?.id || null;
    };

    socket.on("join server", async (user) => {
        await emitConnectedUsers();
    });

    socket.on("request chat", async ({ room, receiverId }) => {
        const receiverSocket = await getReceiverSocket(receiverId);
        if (receiverSocket) {
            socket.to(receiverSocket).emit("open chat", { room });            
        } else {
            console.log(`Receiver ${receiverId} is not online.`);
        }
    });

    socket.on("send game request", async({room, sender}) => {
        if(room._id){
            const receiverSocket = await getReceiverSocket(room._id);
            socket.to(receiverSocket).emit("receive game request", {gameRequest: `${sender.username} wants to play a game with you.`});
        }
        else {
            socket.to(room).emit("receive game request", {gameRequest: `${sender.username} wants to play a game with you.`});
        }
    });

    socket.on("respond game request", async({room, accepted, sender}) => {
        if(room._id){
            const receiverSocket = await getReceiverSocket(room._id);
            const roomId = `${room._id} ${sender._id}`;
            if(accepted){
                socket.to(receiverSocket).emit("game request accepted", roomId)
            } else {
                socket.to(receiverSocket).emit("game request rejected", { message: "Sorry, your request has been refused." });
            }
        } else {
            if(room){
                if(accepted){
                    io.to(room).emit("game request accepted", room)
                } else {
                    socket.to(room).emit("game request rejected", { message: "Sorry, your request has been refused." });
                }
            }
        }
    })

    socket.on("disconnect", async () => {
        console.log(`User ${socket.id} disconnected. Waiting to confirm exit...`);
    
        const userId = socket.data.userId;
        const roomIds = socket.data.rooms ? [...socket.data.rooms] : [];

        // Set a timeout: If the user doesn't reconnect within 5 seconds, they are declared "left"
        setTimeout(async () => {
            const sockets = await io.fetchSockets();
            const stillConnected = sockets.some(s => s.data.userId === userId);

            if (!stillConnected) {
                console.log(`User ${userId} did not reconnect, declaring them as left.`);
                roomIds.forEach(room => {
                    io.to(room).emit("opponent left", { msg: "Your opponent left the game." });
                });
            } else {
                console.log(`User ${userId} reconnected, game continues.`);
            }

        }, 30000); // Wait 9 seconds before taking action

        await emitConnectedUsers();
    });
};

export default userSocket;
