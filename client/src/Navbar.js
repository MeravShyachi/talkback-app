import { Link, useLocation } from "react-router-dom";
import { logout } from "./Logout";
import "./style/navbar.css";

const Navbar = ({username, setUsername}) => {
    const location = useLocation(); // Get the current route

    const handleExit = () => {
        window.close(); // Close the current tab
    };
    
    return (
        <nav className="navbar">
            <h1>Sela TalkBack</h1>
            {username ? (
            <>
                <div className="welcome">
                    <h2>Welcome {username}!</h2>
                </div>
                <div className="links">
                    {location.pathname === "/home" && (      
                        <Link to="/" onClick={logout}>Logout</Link>   
                    )}
                    {(location.pathname === "/chat" || location.pathname === "/game") && (
                        <button onClick={handleExit} className="exitButton">
                            Exit
                        </button>
                    )}    
                </div>
            </>
            ) : (
                <div className="links">
                    <Link className={location.pathname === "/" ? "selectedLink" : ""} to="/">Login</Link>
                    <Link className={location.pathname === "/signup" ? "selectedLink" : ""} to="/signup">Signup</Link>
                </div>
            )}
        </nav>
    );
}
 
export default Navbar;
