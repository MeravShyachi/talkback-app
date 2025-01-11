import { Link, useLocation } from "react-router-dom";
import "./style/navbar.css";

const Navbar = () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("authToken")

    const location = useLocation(); // Get the current route

    const handleExit = () => {
        window.close(); // Close the current tab
    };

    const handleLogout = () => {
        // Clear the localStorage and update state
        localStorage.removeItem("authToken");
    };
    
    return (
        <nav className="navbar">
            <h1>Sela TalkBack</h1>
            {token === null && 
                <div className="links">
                    <Link to="/">Login</Link>
                    <Link to="/signup">Signup</Link>
                </div>
            }

            {token !== null &&
            <>
                <div className="welcome">
                    <h2>Welcome {username}!</h2>
                </div>
                <div className="links">
                    {location.pathname === "/home" && (      
                        <Link to="/" onClick={handleLogout}>Logout</Link>   
                    )}
                    {(location.pathname === "/chat" || location.pathname === "/game") && (
                        <button onClick={handleExit} className="exitButton">
                            Exit
                        </button>
                    )}    
                </div>
            </>
            }
        </nav>
    );
}
 
export default Navbar;
