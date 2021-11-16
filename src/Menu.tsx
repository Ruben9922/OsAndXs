import GameMode from "./gameMode";
import React from "react";

interface Props {
  gameMode: GameMode;
  setGameMode: (updatedGameMode: GameMode) => void;
  startGame: () => void;
}

function Menu({ gameMode, setGameMode, startGame }: Props) {
  return (
    <>
      <div className="flex gap-4">
        {/*<label>*/}
        {/*  <input*/}
        {/*    type="radio"*/}
        {/*    name="game-mode"*/}
        {/*    value="player-vs-ai"*/}
        {/*    checked={gameMode === "player-vs-ai"}*/}
        {/*    onChange={event => {*/}
        {/*      if (event.target.checked) {*/}
        {/*        setGameMode(event.target.value as GameMode);*/}
        {/*      }*/}
        {/*    }}*/}
        {/*  />*/}
        {/*  <span className="ml-1">Player vs. AI</span>*/}
        {/*</label>*/}
        <label>
          <input
            type="radio"
            name="game-mode"
            value="player-vs-player"
            checked={gameMode === "player-vs-player"}
            onChange={event => {
              if (event.target.checked) {
                setGameMode(event.target.value as GameMode);
              }
            }}
          />
          <span className="ml-1">Player vs. player</span>
        </label>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
        onClick={startGame}
      >
        Start game
      </button>
    </>
  );
}

export default Menu;
