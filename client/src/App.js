import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './Navbar';
//import { useState, useEffect } from 'react';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Chat from './Chat';
import Game from './Game';


function App() {

  return (
    <div className="App">
      <Router>
        <div className="App">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Login/>} />
              <Route path="/signup" element={<Signup/>} />
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


