import Symbol from "./symbol";
import Point from "./point";

type Status =
  | { type: "not-started" }
  | { type: "playing", currentPlayer: Symbol }
  // Technically win/draw data is not needed in the state as it can be computed from the board (which is also in the
  // state), but it's just easier to put it in the state!
  | { type: "win", match: Point[], winningPlayer: Symbol }
  | { type: "draw" };

export default Status;
