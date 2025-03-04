import "../../style/gameButton.css";
import { useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import diceIcon from "../../assets/images/diceIcon.png";



const GameButton = ({receiver, socket, room, sender}) => {

    const [isWaiting, setIsWaiting] = useState(false);
    const [isRejected, setIsRejected] = useState(null);
    const [gameRequest, setGameRequest] = useState(null);
    const [noResponseMessage, setNoResponseMessage] = useState(null);
    const timeoutRef = useRef(null);
    const receiverTimeoutRef = useRef(null); // Timer for receiver
    const currentPath = window.location.pathname; // Get current page
    const navigate = useNavigate();


    const handleGameButton = () =>{
        socket.emit("send game request", { room, sender });
        setIsWaiting(true);

        // Set timeout to handle no response case after 1 minute (60000ms)
        timeoutRef.current = setTimeout(() => {
            setIsWaiting(false);
            setGameRequest(null);
            setNoResponseMessage(`There was no response from ${receiver?.username}`);
        }, 20000);
    };

    const handleGameResponse = (accepted) => {
       
        socket.emit("respond game request", {
            room,
            accepted,
            sender
        });
        
        setGameRequest(null); // Close popup
        setIsWaiting(false);

        // Clear timeouts (Sender and Receiver)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (receiverTimeoutRef.current) {
            clearTimeout(receiverTimeoutRef.current);
            receiverTimeoutRef.current = null;
        }

        if(accepted){
            if(currentPath === "/home"){
                const roomId = `${receiver._id} ${sender._id}`;
                socket.emit("join game", ({roomId, sender}))
                navigate({
                    pathname: `${currentPath}/game`,
                    search: `?room=${roomId}`
                  });

            } else {
                navigate({
                    pathname: `${currentPath}/game`,
                    search: `?room=${room}`
                });
            }
        }
    };

    useEffect(() => {
        //Listen for game requests
        socket.on("receive game request", ({ gameRequest }) => {
            setGameRequest(gameRequest);
            // Receiver: Start timeout to auto-close after 1 minute
            receiverTimeoutRef.current = setTimeout(() => {
                setGameRequest(null); // Close request popup
                setNoResponseMessage("The game request expired due to no response.");
            }, 20000);
        });

        //Listen for game responses
        socket.on("game request accepted", (roomId) => {
            setIsWaiting(false); // Close waiting popup
            if(currentPath === "/home"){
                socket.emit("join game", ({roomId, sender}))
            }
            navigate({
                pathname: `${currentPath}/game`,
                search: `?room=${roomId}`
            });
            
            // Clear timeouts
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (receiverTimeoutRef.current) {
                clearTimeout(receiverTimeoutRef.current);
                receiverTimeoutRef.current = null;
            }
        });

        socket.on("game request rejected", ({ message }) => {
            setIsWaiting(false); // Close waiting popup
            setIsRejected(message);

            // Clear timeouts
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (receiverTimeoutRef.current) {
                clearTimeout(receiverTimeoutRef.current);
                receiverTimeoutRef.current = null;
            }
        });

        return () => {
            socket.off("receive game request");
            socket.off("game request accepted");
            socket.off("game request rejected");


            // Clear timeouts on unmount
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (receiverTimeoutRef.current) {
                clearTimeout(receiverTimeoutRef.current);
            }
        };
        

    },[ socket, navigate, room])

    return (
        <>
        <div>
            <button
                onClick={handleGameButton}
                className="action-button"
            >
                <img
                    src={diceIcon} // Path to your image
                    alt="ivite for a game"
                    className="game-button"
                />
                <span className="tooltip">Invite for a game</span>
            </button>
        </div>
        {isWaiting && (
            <div className="waiting-popup">
                <p>Wait for connection...</p>
            </div>
        )}
        {gameRequest && (
            <div className="game-popup">
                <p>{`${gameRequest}`}</p>
                <button onClick={() => handleGameResponse(true)}>Accept</button>
                <button onClick={() => handleGameResponse(false)}>Reject</button>
            </div>
        )}
        {isRejected && (
            <div className="waiting-popup">
                <p>{isRejected}</p>
                <button onClick={() => {setIsRejected(null)}}>ok</button>
            </div>
        )}
        {/* No Response Message */}
        {noResponseMessage && (
            <div className="waiting-popup">
                <p>{noResponseMessage}</p>
                <button onClick={() => setNoResponseMessage(null)}>OK</button>
            </div>
        )}
        </>
    );
};

export default GameButton;
