import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Chat from './Chat';
import Game from './Game';

function App() {

   const [username, setUsername] = useState('');

  //const [isLoggedIn, setIsLoggedIn] = useState(false);



  // Function to handle form submission
  const handleFormSubmit =  (name) => {
    
    //setIsLoggedIn(true)
    setUsername(name)
  
    
    // Save state to localStorage
    localStorage.setItem("authToken", "loggedin");
    localStorage.setItem("username", name);
  };

  return (
    <div className="App">
      <Router>
        <div className="App">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Login onFormSubmit={handleFormSubmit} username={username}/>} />
              <Route path="/signup" element={<Signup onFormSubmit={handleFormSubmit} username={username}/>} />
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


