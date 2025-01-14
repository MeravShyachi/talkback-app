import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './Navbar';
import { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Chat from './Chat';
import Game from './Game';


function App() {

   const [username, setUsername] = useState(null);


  // Function to handle form submission
  // const handleFormSubmit =  (name) => {
  //   setUsername(name)

  // };

  return (
    <div className="App">
      <Router>
        <div className="App">
          <Navbar username={username} setUsername={setUsername}/>
          <div className="content">
            <Routes>
              <Route path="/" element={<Login setUsername={setUsername}/>} />
              <Route path="/signup" element={<Signup  setUsername={setUsername}/>} />
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


