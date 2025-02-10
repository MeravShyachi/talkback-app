import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Game from "./pages/Game";
import { SocketProvider } from "./context/SocketContext"; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("authToken"));

  useEffect(() => {
    const checkAuth = () => {
      console.log("in check auth");
      setIsAuthenticated(!!sessionStorage.getItem("authToken"));
    };

    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <SocketProvider isAuthenticated={isAuthenticated}> 
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/game" element={<Game />} />
            </Routes>
          </div>
        </SocketProvider>
      </Router>
    </div>
  );
}

export default App;
