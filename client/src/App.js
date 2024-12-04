import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginSignup from './LoginSignup';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import Home from './Home';
import Chat from './Chat';
import Game from './Game';

function App() {
  const [title, setTitle] = useState('Login'); // Holds the title state
  const [action, setAction] = useState('Signup'); // Holds the action for Navbar
  const [username, setUsername] = useState('');

    // Load state from localStorage on component mount
    useEffect(() => {
      const savedAction = localStorage.getItem("navbarAction");
      if (savedAction === "Logout") {
        setAction(savedAction);
      }
    }, []);

  // Function to toggle title and action between Login and Signup
  const toggleTitleAndAction = () => {
    if (title === "Login") {
      setTitle("Signup");
      setAction("Login");
    } else {
      setTitle("Login");
      setAction("Signup");
    }

    // Save state to localStorage
    localStorage.setItem("navbarAction", action);
  };

  // Function to handle form submission
  const handleFormSubmit = (name) => {
    setTitle("");
    setAction("Logout");  // Change the action to Logout
    setUsername(name)
    
    // Save state to localStorage
    localStorage.setItem("navbarAction", "Logout");
    localStorage.setItem("username", name);
  };

  return (
    <div className="App">
      <Router>
        <div className="App">
          <Navbar action={action} toggleTitleAndAction={toggleTitleAndAction} />
          <div className="content">
            <Routes>
              <Route path="/" element={<LoginSignup title={title} onFormSubmit={handleFormSubmit} username={username}/>} />
              <Route path="/home" element={<Home/>}/>
              <Route path="/chat" element={<Chat/>}/>
              <Route path="/game" element={<Game/>}/>
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;


