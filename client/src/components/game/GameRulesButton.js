import { useState } from "react";
import "../../style/gameRulesButton.css";

export default function GameRulesButton() {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="game-rules-container">
      {/* Info Button */}
      <button
        className="info-button"
        onClick={() => setShowRules(!showRules)}
      >
        i
      </button>

      {/* Rules Box */}
      {showRules && (
        <div className="rules-box">
          <h3>Game Rules</h3>

          <h4>Objective of the Game</h4>
          <p>The goal is to be the last player with at least one die remaining.</p>

          <h4>Setup</h4>
          <ul>
            <li>Each player starts with five blue dice.</li>
            <li>To roll the dice, press the <strong>"Start"</strong> button.</li>
            <li>The player who initiates the game starts the first round.</li>
          </ul>

          <h4>Gameplay Overview</h4>
          <ol>
            <li>Players press <strong>"Start"</strong> to roll their dice. Each player <u>cannot</u> see the other player's dice values.</li>
            <li>The first player makes a bid, estimating how many dice of a certain value exist among all players' dice. The player must select:
              <ul>
                <li>A quantity (e.g., <strong>"five"</strong>)</li>
                <li>A die value (e.g., <strong>"3s"</strong>)</li>
              </ul>
            </li>
            <li>The next player must either:
              <ul>
                <li><strong>Outbid</strong> by increasing the quantity or value of the dice.</li>
                <li><strong>Challenge</strong> the bid by pressing <strong>"Liar!"</strong>.</li>
                <li><strong>Call an exact match</strong> by pressing <strong>"Exact!"</strong>.</li>
              </ul>
            </li>
          </ol>

          <h4>Challenge Rules</h4>
          <ul>
            <li><strong>On "Liar!":</strong>
              <ul>
                <li>If the bid was <u>correct</u> or <u>too low</u>, the challenger <strong>loses a die</strong>.</li>
                <li>If the bid was <u>too high</u>, the bidder <strong>loses a die</strong>.</li>
              </ul>
            </li>
            <li><strong>On "Exact!":</strong>
              <ul>
                <li>If the bid was <u>exactly correct</u>, the bidder <strong>loses a die</strong>.</li>
                <li>If the bid was <u>not exact</u>, the player who pressed <strong>"Exact!"</strong> <strong>loses a die</strong>.</li>
              </ul>
            </li>
          </ul>

          <h4>Turn Time</h4>
          <p>Each player has <strong>40 seconds</strong> to take their turn. If a player does not play within 40 seconds, the opponent <strong>automatically wins</strong>.</p>

          <h4>Making a Bid</h4>
          <ul>
            <li>The first player announces a bid, estimating how many dice of a certain value exist among all players' dice.</li>
            <li>Ones (<strong>1s</strong>) are treated as <strong>wild</strong> and count toward any bid.</li>
          </ul>

          <h4>Responding to a Bid</h4>
          <ul>
            <li>A player must either <strong>outbid</strong> or <strong>challenge</strong> the bid.</li>
          </ul>

          <h4>Outbidding</h4>
          <ul>
            <li>There are two ways to outbid:
              <ul>
                <li><strong>Increasing the quantity</strong> of dice (e.g., raising from <strong>"five 3s"</strong> to <strong>"six 3s"</strong>).</li>
                <li><strong>Raising the value</strong> of the dice (e.g., raising from <strong>"five 3s"</strong> to <strong>"four 4s"</strong>).</li>
              </ul>
            </li>
          </ul>

          <h4>Challenging a Bid</h4>
          <ul>
            <li>If a player thinks the bid is too high, they press <strong>"Liar!"</strong>.</li>
            <li>All dice are revealed, and the matching dice are counted:
              <ul>
                <li>If the total <u>meets or exceeds</u> the bid, the challenger <strong>loses a die</strong>.</li>
                <li>If the total is <u>lower</u>, the bidder <strong>loses a die</strong>.</li>
              </ul>
            </li>
            <li>If a player believes the bid is <strong>exactly correct</strong>, they press <strong>"Exact!"</strong>.</li>
            <li>All dice are revealed, and the matching dice are counted:
              <ul>
                <li>If the bid was <u>exact</u>, the bidder <strong>loses a die</strong>.</li>
                <li>If incorrect, the player who pressed <strong>"Exact!"</strong> <strong>loses a die</strong>.</li>
              </ul>
            </li>
          </ul>

          <h4>Winning the Game</h4>
          <p>The game continues until only one player has dice remaining. The last remaining player <strong>wins the game</strong>.</p>

        </div>
      )}
    </div>
  );
}

