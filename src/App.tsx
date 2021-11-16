import React, {useState} from "react";
import Game from "./Game";
import GameMode from "./gameMode";
import Menu from "./Menu";

type View = "menu" | "game";

function App() {
  const [view, setView] = useState<View>("menu");
  const [gameMode, setGameMode] = useState<GameMode>("player-vs-player");

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-700 gap-4 text-white">
      {view === "menu" && (
        <Menu gameMode={gameMode} setGameMode={setGameMode} startGame={() => setView("game")} />
      )}
      {view === "game" && (
        <Game navigateToMenu={() => setView("menu")} />
      )}
    </div>
  );
}

export default App;
