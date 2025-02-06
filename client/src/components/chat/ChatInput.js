import "../../style/chatInput.css";
import { useState } from "react";
import sendIcon from "../../assets/images/sendIcon.png";

const ChatInput = ({handleSendMessage}) => {
    const [newMessage, setNewMessage] = useState("");

    const handleMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        const trimmedMessage = newMessage.trim();

        if (trimmedMessage.length > 0) {
            handleSendMessage(trimmedMessage)
            setNewMessage("");
        }
    };

    return (
        <form className="input-container" onSubmit={sendMessage}>
            <textarea
                placeholder="Type your message here..."
                onChange={handleMessageChange}
                value={newMessage}
                onInput={(e) => {
                    e.target.style.height = "15px"; // Reset height
                    if (e.target.value.trim() !== "") {
                        e.target.style.height = e.target.scrollHeight + "px"; // Expand based on content
                    }
                }}
            />
            <button type="submit">
                <img src={sendIcon} alt="chat" />
            </button>
        </form>
    );
};

export default ChatInput;
