import { Link, useLocation } from "react-router-dom";
import "./style/navbar.css";

const Navbar = ({ action, toggleTitleAndAction }) => {
    const username = localStorage.getItem("username");

    const location = useLocation(); // Get the current route

    const handleExit = () => {
        window.close(); // Close the current tab
    };
    
    return (
        <nav className="navbar">
            <h1>Sela TalkBack</h1>
            <div className="welcome">
                {action === "Logout" ? <h2>Welcome {username}!</h2>: ""}
            </div>
            <div className="links">
                {(location.pathname !== "/chat" && location.pathname !== "/game") && (
                    <Link to="/" onClick={toggleTitleAndAction}>{action}</Link>
                )}
                {(location.pathname === "/chat" || location.pathname === "/game") && (
                    <button onClick={handleExit} className="exitButton">
                        Exit
                    </button>
                )}
            </div>
        </nav>
    );
}
 
export default Navbar;
