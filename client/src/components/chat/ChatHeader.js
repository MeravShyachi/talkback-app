import "../../style/chatHeader.css"
import personIcon from "../../assets/images/personIcon.jpg";
import GameButton from "../game/GameButton";
import { Volume2, VolumeX } from "lucide-react"; // Icons for sound on/off

const ChatHeader = ({ receiver, isMuted, toggleMute, socket, room, sender}) => {

    return (
        <div className="chat-header">
            <img src={personIcon} alt="chat" className="personImage" />
            <p>Chat with {receiver?.username}</p>
            <div className="button-group">
            <GameButton receiver={receiver} socket={socket} room={room} sender={sender}/>
                {/* Mute/Unmute Button */}
                <button onClick={toggleMute} className="mute-button">
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
