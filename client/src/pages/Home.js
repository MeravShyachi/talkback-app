import { useState, useEffect, useRef } from "react";
import chatIcon from "../assets/images/chatIcon.jpg";
import diceIcon from "../assets/images/diceIcon.png";
import "../style/home.css";
import userApi from "../api/userApi.js";
import { useNavigate } from "react-router-dom";
import { socket } from "../utils/socket.js";


const Home = () => {

    const [users, setUsers] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([])
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();
    const socketRef = useRef();

    useEffect(() => {
        if(!sessionStorage.getItem("authToken")){
            navigate("/");
        }
    },[])

    useEffect(() => {
        const getUsers = async() =>{
            try{
                const response = await userApi.getAll();
                console.log("Headers sent with request:", response.config.headers); // Debug headers
                const user = response.data.currentUser;
                console.log("user: ",user);
                setCurrentUser(user); 
                setUsers(response.data.users);

            }catch(error){
                console.error("Token verification failed:", error);
                navigate("/"); // Redirect to login if token is invalid
            }
        };

        getUsers();
    }, [])

    useEffect(() => {
        if(currentUser !== undefined && !socketRef.current){
            console.log("current user: ",currentUser)
            socketRef.current = socket.connect("/");
            socketRef.current.emit("join server", currentUser)
            socketRef.current.on("connectedUsers", (userIds) => {
                setConnectedUsers(userIds);
            });  

            // Cleanup function: disconnect when the component unmounts
            return () => {
                socketRef.current.disconnect();
            }
        }     
    },[currentUser?._id])

    useEffect(() => {  // to open the chat tab for the receiver.
        console.log("in open chat")
        if(!socketRef.current) return;
        socketRef.current.on("open chat", ({ room }) => {
            window.open(`/chat?room=${room}`, "_blank");
        });
    
        return () => socketRef.current.off("open chat");
    }, [socketRef.current]);
  
      
    const handleChatButton = (e, userId) => {
        e.preventDefault(); //prevent reload of the page.
        const room = `${userId} ${currentUser?._id}`;
        socketRef.current.emit("request chat", {room, senderId: currentUser?._id, receiverId: userId})
        window.open(`/chat?room=${room}`, "_blank");
    };

    const handleGameButton = (e) => {
        e.preventDefault(); //prevent reload of the page.
        window.open("/game", "_blank");
    };

    const onlineUsers = users.filter((user) =>
        connectedUsers.includes(user._id)
    );
    const offlineUsers = users.filter(
        (user) => !connectedUsers.includes(user._id)
    );

    return ( 
        <div className="home">
            <div className="contactContainer">
            <h2>Welcome {currentUser?.username}!</h2>
                <div className="contacts">
                    {/* Render online Users */}
                    {onlineUsers.map((user) => (
                        <div className="onlineContacts" key={user.username}>
                            <ul>
                                <li className="contactItem">
                                    <span style={{ color: "#18a982" }}>{user.username}</span>
                                    <div className="contactActions">
                                        <button
                                            onClick={(e) => handleChatButton(e, user._id)}
                                            className="actionButton"
                                        >
                                            <img
                                                src={chatIcon} // Path to your image
                                                alt="chat"
                                                className="actionImage"
                                            />
                                        </button>
                                        <button
                                            onClick={handleGameButton}
                                            className="actionButton"
                                        >
                                            <img
                                                src={diceIcon} // Path to your image
                                                alt="game"
                                                className="actionImage"
                                            />
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ))}

                    {/* Render Offline Users */}
                    {offlineUsers.map((user) => (
                        <div className="offlineContacts" key={user.username}>
                            <ul>
                                <li className="contactItem">
                                    <span>{user.username}</span>
                                    <span
                                        style={{
                                            color: "#f1356d",
                                            marginLeft: "auto",
                                            fontSize: "14px",
                                        }}
                                    >
                                        Not Connected
                                    </span>
                                </li>
                            </ul>
                        </div>
                    ))} 
                </div>
            </div>
        </div>
     );
}
 
export default Home;
