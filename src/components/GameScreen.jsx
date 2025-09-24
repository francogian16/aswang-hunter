import React from "react";
import { useGame } from "../contexts/GameContext";
import StatusBar from "./StatusBar";

function GameScreen() {
  const { playerState, currentNodeKey, storyData, makeChoice, restartGame } =
    useGame();

  const currentNode = storyData[currentNodeKey];

  // This initial check is still good for safety.
  if (!currentNode) {
    return <div>Error: Story node not found!</div>;
  }

  // --- THIS IS THE CRITICAL FIX ---
  // If the current node is an ending, we must render a special final screen
  // and return immediately. This stops the component from trying to access
  // '.choices' which doesn't exist on ending nodes.
  if (currentNode.isEnding) {
    return (
      <div className="game-container">
        <StatusBar />
        <div className="story-panel">
          <p className="story-text">{currentNode.text}</p>
        </div>
        <div className="choices-panel">
          <button onClick={restartGame} className="choice-btn restart-btn">
            --- The Story Ends. Play Again? ---
          </button>
        </div>
      </div>
    );
  }
  // --- END OF CRITICAL FIX ---

  // This code will now ONLY be reached if it's NOT an ending node.
  // This guarantees 'currentNode.choices' exists and is an array.
  const availableChoices = currentNode.choices.filter((choice) => {
    // Hide choice if it requires an item the player doesn't have
    if (choice.requires && !playerState.inventory.includes(choice.requires)) {
      return false;
    }
    // Hide choice if the player has an item that should prevent this choice
    if (choice.hideIf && playerState.inventory.includes(choice.hideIf)) {
      return false;
    }
    return true;
  });

  // This is the return path for a normal, ongoing game node.
  return (
    <div className="game-container">
      <StatusBar />
      <div className="story-panel">
        <p className="story-text">{currentNode.text}</p>
      </div>
      <div className="choices-panel">
        {availableChoices.map((choice, index) => (
          <button
            key={index}
            onClick={() => makeChoice(choice)}
            className="choice-btn"
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameScreen;
