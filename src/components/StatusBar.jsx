import React from "react";
import { useGame } from "../contexts/GameContext";

function StatusBar() {
  const { playerState } = useGame();

  if (!playerState) return null;

  const hpPercentage = (playerState.hp / playerState.maxHp) * 100;

  return (
    <div className="status-bar">
      <div className="status-item">
        <strong>Hunter:</strong> {playerState.name}
      </div>
      <div className="status-item hp-status">
        <strong>HP:</strong>
        <div className="hp-bar-container">
          <div className="hp-bar" style={{ width: `${hpPercentage}%` }}></div>
        </div>
        <span>
          {playerState.hp} / {playerState.maxHp}
        </span>
      </div>
      <div className="status-item">
        <strong>Inventory:</strong> {playerState.inventory.join(", ")}
      </div>
    </div>
  );
}

export default StatusBar;
