const userSocket = (io, socket) => {
    
    const emitConnectedUsers = async () => {
        const sockets = await io.fetchSockets();
        const connectedUsers = sockets
            .map(s => s.data.userId)
            .filter(userId => userId); // Ensure no undefined values
        console.log("connectedUsers ", connectedUsers)
        io.emit("connected users", connectedUsers); // Emit to all clients
    };

    const getReceiverSocket = async (receiverId) => {
        const sockets = await io.fetchSockets();
        const receiverSocket = sockets.find(socket => socket.data.userId === receiverId);

        return receiverSocket?.id || null;
    };

    socket.on("join server", async (user) => {
        console.log("User joined server:", user);
        
        socket.data.userId = user._id;
        await emitConnectedUsers();
    });

    socket.on("request chat", async ({ room, receiverId }) => {
        console.log("room: ", room);
        const receiverSocket = await getReceiverSocket(receiverId);
        if (receiverSocket) {
            io.to(receiverSocket).emit("open chat", { room });            
        } else {
            console.log(`Receiver ${receiverId} is not online.`);
        }
    });

    socket.on("send game request", async({room, sender}) => {
        console.log(`${sender.username} is requesting a game with ${room}`);
        if(room._id){
            const receiverSocket = await getReceiverSocket(room._id);
            socket.to(receiverSocket).emit("receive game request", {gameRequest: `${sender.username} wants to play a game with you.`});
        }
        else {
            socket.to(room).emit("receive game request", {gameRequest: `${sender.username} wants to play a game with you.`});
        }
    });

    socket.on("respond game request", async({room, accepted}) => {
        if(room._id){
            const receiverSocket = await getReceiverSocket(room._id);
            if(accepted){
                io.to(receiverSocket).emit("game request accepted")
            } else {
                socket.to(receiverSocket).emit("game request rejected", { message: "Sorry, your request has been refused." });
            }
        } else {
            if(accepted){
                io.to(room).emit("game request accepted")
            } else {
                socket.to(room).emit("game request rejected", { message: "Sorry, your request has been refused." });
            }
        }
    })

    socket.on("disconnect", async () => {
        console.log("User disconnected:", socket.id);
        await emitConnectedUsers();
    });
};

export default userSocket;
