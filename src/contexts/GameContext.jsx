import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react"; // 1. Import useEffect
import { useLocalStorage } from "../hooks/useLocalStorage";
import storyData from "../../public/data/story.json";

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

const INITIAL_PLAYER_STATE = {
  name: "",
  hp: 100,
  maxHp: 100,
  inventory: ["Bolo Knife"],
};

export function GameProvider({ children }) {
  const [playerState, setPlayerState] = useLocalStorage("playerState", null);
  const [currentNodeKey, setCurrentNodeKey] = useLocalStorage(
    "currentNodeKey",
    "start"
  );
  const [gameStarted, setGameStarted] = useLocalStorage("gameStarted", false);

  // 2. Add the useEffect hook to monitor the player's health
  useEffect(() => {
    // This effect will run every time the player's state is updated.
    // We check if the player exists and if their HP is 0 or less.
    if (playerState && playerState.hp <= 0) {
      // To prevent a re-render loop, we only change the node if we aren't already on the game over screen.
      if (currentNodeKey !== "gameOver_hp") {
        console.log("Player HP is 0 or less. Forcing Game Over.");
        setCurrentNodeKey("gameOver_hp");
      }
    }
    // The dependency array ensures this effect runs only when these values change.
  }, [playerState, currentNodeKey, setCurrentNodeKey]);

  const startGame = useCallback(
    (name) => {
      setPlayerState({ ...INITIAL_PLAYER_STATE, name });
      setCurrentNodeKey("start");
      setGameStarted(true);
    },
    [setPlayerState, setCurrentNodeKey, setGameStarted]
  );

  const restartGame = useCallback(() => {
    setGameStarted(false);
    setPlayerState(null);
    setCurrentNodeKey("start");
  }, [setGameStarted, setPlayerState, setCurrentNodeKey]);

  const makeChoice = useCallback(
    (choice) => {
      // If the game is already over (HP is 0), prevent further choices.
      if (playerState.hp <= 0) {
        return;
      }

      const nextNode = storyData[choice.to];
      if (!nextNode) {
        console.error(`Story node "${choice.to}" not found!`);
        return;
      }

      // Apply effects of arriving at the new node
      if (nextNode.onArrive) {
        setPlayerState((currentState) => {
          let newState = { ...currentState };
          if (nextNode.onArrive.addItem) {
            newState.inventory = [
              ...new Set([...newState.inventory, nextNode.onArrive.addItem]),
            ];
          }
          if (nextNode.onArrive.takeDamage) {
            // Use Math.max to ensure HP doesn't go below 0
            newState.hp = Math.max(
              0,
              newState.hp - nextNode.onArrive.takeDamage
            );
          }
          if (nextNode.onArrive.setHp !== undefined) {
            newState.hp = nextNode.onArrive.setHp;
          }
          return newState;
        });
      }

      setCurrentNodeKey(choice.to);
    },
    [playerState, setPlayerState, setCurrentNodeKey]
  ); // Added playerState to dependency array

  const value = {
    playerState,
    currentNodeKey,
    storyData,
    gameStarted,
    startGame,
    restartGame,
    makeChoice,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
