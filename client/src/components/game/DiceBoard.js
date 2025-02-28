import { useEffect, useState } from "react";
import "../../style/diceBoard.css"; // Import the CSS file

const DiceBoard = ({diceArray, rolling, opponentNumDice, opponentRollDice}) => {
  return (
    <div className="game-container">
      <div className="dice-container opponent-dice-container">
        {Array.from({ length: opponentNumDice }).map((_, index) => (
          <div 
            key={index} 
            className={`dice opponent-dice ${opponentRollDice ? "rolling" : ""}`} 
          >
            <span className="dice-question-mark">?</span> 
          </div>
        ))}
      </div>
      <div className="dice-container">
      {diceArray.map((num, index) => (
          <div key={index} className={`dice dice-${num} ${rolling ? "rolling" : ""}`}>
            {Array.from({ length: num }).map((_, i) => (
              <div key={i} className="dot"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiceBoard;
