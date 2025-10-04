import React, { useState } from "react";
import { useGame } from "../contexts/GameContext";

function StartScreen() {
  const [name, setName] = useState("");
  const { startGame } = useGame();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      startGame(name.trim());
    }
  };

  return (
    <div className="start-screen">
      <h1>Aswang Hunter V3</h1>
      <p>The Midnight Chronicles</p>
      <p>by Sir Franco</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your hunter's name"
          required
        />
        <button type="submit">Begin the Hunt</button>
      </form>
    </div>
  );
}

export default StartScreen;
