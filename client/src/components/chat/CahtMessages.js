import "../../style/chatMessages.css"
import { useEffect, useRef } from "react";

const ChatMessages = ({ messages }) => {
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-message">
            {messages.map((message, index) => {
                // 🔹 Default status to "sent" if it doesn't exist
                const statusClass = message.status ? message.status : "sent";
                
                return (
                    <div key={index} className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                        <div className="content">
                            {message.system ? ( 
                                <p className="system-message">{message.message}</p> // 🔹 Show system messages differently
                            ) : (
                                <>
                                    <p>{message.message}</p>
                                    {message.fromSelf && (
                                        <span className={`status ${statusClass}`}>
                                            {statusClass === "pending" && "🕓 Sending..."}
                                            {statusClass === "sent" && "✔ Sent"}
                                            {statusClass === "failed" && "❌ Failed"}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
            {/* This empty div will be used to scroll to the bottom */}
            <div ref={scrollRef} />
        </div>
    );
};

export default ChatMessages;
