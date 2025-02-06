const gameSocket =(io, socket) => {

    socket.on("send game request", ({room, sender}) => {
        console.log(`${sender.username} is requesting a game`);
        socket.to(room).emit("receive game request", {gameRequest: `${sender} wants to play a game with you.`});

    });

    socket.on("respond game request", ({room, accepted}) => {
        if(accepted){
            io.to(room).emit("game request accepted")
        } else {
            socket.to(room).emit("game request rejected", { message: "Sorry, your request has been refused." });
        }
    })
}

export default gameSocket;