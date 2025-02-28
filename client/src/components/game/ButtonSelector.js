import React, { useEffect, useState } from "react";
import "../../style/buttonSelector.css"; // Import CSS

const ButtonSelector = ({socket, room, yourTurn, opponentTimes, opponentNumber, diceArray, setTurnTimer}) => {
  const timesOptions = Array.from({ length: 12 }, (_, i) => i + 1); // [1-12]
  const numberOptions = [2, 3, 4, 5, 6]; // [2-6]

  const [selectedTimes, setSelectedTimes] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);

  const handleTimesClick = (times) => {
    setSelectedTimes(times);
  };

  const handleNumberClick = (num) => {
    setSelectedNumber(num);
  };

  const handleSendButton = () => {
    setSelectedNumber(null);
    setSelectedTimes(null);
    if(socket){
      socket.emit("end turn", {room, selectedTimes, selectedNumber});
    }
    setTurnTimer(40);
  }

  const handleLiarButton = () => {
    setSelectedNumber(null);
    setSelectedTimes(null);
    if(socket){
      socket.emit("liar", {room, opponentDiceArray: diceArray, times: opponentTimes, num: opponentNumber});
    }
  }

  const handleExactButton = () => {
    setSelectedNumber(null);
    setSelectedTimes(null);
    if(socket){
      socket.emit("exact", {room, opponentDiceArray: diceArray, times: opponentTimes, num: opponentNumber});
    }
  }

  return (
    <div className="button-selector">
      {/* Times Buttons */}
      <div className="section">
        <h3>Quantity:</h3>
        <div className="buttons">
          {timesOptions.map((time) => (
            <button
              key={time}
              className={`btn ${selectedTimes === time ? "selected" : ""}`}
              onClick={() => handleTimesClick(time)}
              disabled={
                !yourTurn ||
                (yourTurn && time < opponentTimes) || 
                (yourTurn && selectedNumber && selectedNumber <= opponentNumber && time === opponentTimes)
              }
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Number Buttons */}
      <div className="section">
        <h3>Value:</h3>
        <div className="buttons">
          {numberOptions.map((num) => (
            <button
              key={num}
              className={`btn ${selectedNumber === num ? "selected" : ""}`}
              onClick={() => handleNumberClick(num)}
              disabled={
                !yourTurn || 
                // (yourTurn && num < opponentNumber) ||
                (yourTurn && selectedTimes === opponentTimes && num <= opponentNumber)
              }
            >
              {num}
            </button>
          ))}
        </div>
        <div className="button">
          {selectedTimes && selectedNumber &&
            <button className="send-button" disabled={!yourTurn} onClick={handleSendButton}>
              Send
            </button>
          }
          <div>
          {opponentNumber && opponentTimes && yourTurn &&
          <>
              <button className={"liar-button"} onClick={handleLiarButton}>Liar!</button>
              <button className={"exact-button"} onClick={handleExactButton}>Exact!</button>
          </>
          }

          </div>

        </div>


      </div>
    </div>
  );
};

export default ButtonSelector;
