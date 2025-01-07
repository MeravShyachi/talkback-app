import { useState, useEffect } from "react";
import chatIcon from "./assets/images/chatIcon.jpg";
import diceIcon from "./assets/images/diceIcon.jpg";
import "./style/home.css";
import axios from "axios";


const Home = () => {

    const [Contacts, setContacts] = useState([]);
    
    //async-await
    const getPeople = async() => {
        try {
            const res = await axios.get("http://localhost:4000/people");
            setContacts(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPeople();
    }, [])
    
      
    const handleChatButton = (e) => {
        e.preventDefault(); //prevent reload of the page.
        window.open("/chat", "_blank");
    };

    const handleGameButton = (e) => {
        e.preventDefault(); //prevent reload of the page.
        window.open("/game", "_blank");
    };

    return ( 
        <div className="home">
            <div className="contactContainer">
                <div className="contacts">
                    <div className="onlineContacts">
                        {Contacts.filter(contact => contact.isOnline).map(contact => (
                            <ul>
                                <li key={contact.id} className="contactItem">
                                    <span style={{color: "#18a982"}}>{contact.name}</span>
                                    <div className="contactActions">
                                    <button
                                        onClick={handleChatButton}
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
                        ))}
                    </div>
                    <div className="offlineContacts">
                        {Contacts.filter(contact => !contact.isOnline).map(contact => (
                            <ul key={contact.id} >
                                <li className="contactItem">{contact.name}
                                <span style={{ color: "#f1356d", marginLeft: "auto", fontSize: "14px"}}>
                                    Not Connected
                                </span>
                                </li>
                            </ul>
                        ))}
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Home;
