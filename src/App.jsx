import React from "react";
import { useGame } from "./contexts/GameContext";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import "./App.css";

function App() {
  const { gameStarted } = useGame();

  return (
    <div className="app-background">
      {gameStarted ? <GameScreen /> : <StartScreen />}
    </div>
  );
}

export default App;
