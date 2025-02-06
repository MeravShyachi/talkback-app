import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Game from './pages/Game';



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


