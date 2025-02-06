import "../../style/chatHeader.css"
import personIcon from "../../assets/images/personIcon.jpg";
import diceIcon from "../../assets/images/diceIcon.png";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react"; // Icons for sound on/off

const ChatHeader = ({ receiver, isMuted, toggleMute, socketRef, room, sender}) => {
    const [isWaiting, setIsWaiting] = useState(false);
    const [isRejected, setIsRejected] = useState(null);
    const [gameRequest, setGameRequest] = useState(null);
    const navigate = useNavigate();

    const handleGameButton = () =>{
        if (socketRef.current) {
            socketRef.current.emit("send game request", { room, sender });
            setIsWaiting(true);
        } else {
            console.error("Socket is not initialized.");
        }
    };

    const handleGameResponse = (accepted) => {
        if (socketRef.current) {
            socketRef.current.emit("respond game request", {
                room,
                accepted,
            });
        }
        setGameRequest(null); // Close popup
        if(accepted){
            navigate(`/game?room=${room}`);
        }
    };

    useEffect(() => {
        console.log(socketRef.current);
        if(!socketRef.current) return;
            
            // Listen for game requests
            socketRef.current.on("receive game request", ({ gameRequest }) => {
                console.log("in receive game req");
                setGameRequest(gameRequest);
            });

            // Listen for game responses
            socketRef.current.on("game request accepted", () => {
                setIsWaiting(false); // Close waiting popup
                navigate(`/game?room=${room}`); // Redirect to game page
            });

            socketRef.current.on("game request rejected", ({ message }) => {
                setIsWaiting(false); // Close waiting popup
                setIsRejected(message);
            });

            return () => {
                socketRef.current.off("receive game request");
                socketRef.current.off("game request accepted");
                socketRef.current.off("game request rejected");
            };
        

    },[socketRef, navigate, room])

 



    return (
        <div className="chat-header">
            <img src={personIcon} alt="chat" className="personImage" />
            <p>Chat with {receiver?.username}</p>
            <div className="button-group">
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

                {/* Mute/Unmute Button */}
                <button onClick={toggleMute} className="mute-button">
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
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
        </div>
    );
};

export default ChatHeader;
