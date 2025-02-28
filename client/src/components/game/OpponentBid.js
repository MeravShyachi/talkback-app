import "../../style/opponentBid.css"
import React, { useState, useEffect } from "react";

const OpponentBid = ({opponent, opponentTimes, opponentNumber}) => {



  return (
      <div className="game-container">
          <div className="opponent-bid-container">
              <p className="opponent">{opponent.username}'s Bid: </p>
              <p className="bid">Times:   {opponentTimes}</p>
              <p className="bid">Number:   {opponentNumber}</p>
          </div>
      </div>
  )
}

export default OpponentBid;