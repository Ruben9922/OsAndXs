import React from "react";
import {useImmerReducer} from "use-immer";
import * as R from "ramda";
import { CgClose, CgShapeCircle } from "react-icons/cg";
import {IconType} from "react-icons";

type Point = [number, number];
type Symbol = "X" | "O";
type Board = (Symbol | null)[][];
type Status =
  | { type: "not-started" }
  | { type: "playing", currentPlayer: Symbol }
  // Technically win/draw data is not needed in the state as it can be computed from the board (which is also in the
  // state), but it's just easier to put it in the state!
  | { type: "win", match: Point[], winningPlayer: Symbol }
  | { type: "draw" };

interface State {
  board: Board;
  status: Status;
}

type Action =
  | { type: "start-game" }
  | { type: "take-turn", coords: Point };

const gridSize: Point = [3, 3];
const matchLength: number = 3;

const initialBoard: Board = R.repeat(R.repeat(null, gridSize[1]), gridSize[0]);
const initialState: State = {
  board: initialBoard,
  status: { type: "not-started" },
};

function findMatch(board: Board): Point[] | null {
  const directions: Point[] = [
    [0, 1], // Horizontal
    [1, 0], // Vertical
    [1, 1], // Diagonally down
    // [-1, 1], // Diagonally up
  ];

  for (const direction of directions) {
    // const rowIndex1 = Math.max(0, (matchLength * direction[0]) - 1);
    // const rowIndex2 = 0;
    const minRowIndex = 0;//Math.min(rowIndex1, rowIndex2);
    const maxRowIndex = gridSize[0] - Math.max(1, matchLength * direction[0]);//Math.max(rowIndex1, rowIndex2);

    for (let rowIndex = minRowIndex; rowIndex <= maxRowIndex; rowIndex++) {
      const minColumnIndex = 0;
      const maxColumnIndex = gridSize[1] - Math.max(1, matchLength * direction[1]);

      for (let columnIndex = minColumnIndex; columnIndex <= maxColumnIndex; columnIndex++) {
        const line: Point[] = R.map(i => [
          rowIndex + (i * direction[0]),
          columnIndex + (i * direction[1]),
        ], R.range(0, matchLength));

        const lineSymbols: (Symbol | null)[] = R.map(p => board[p[0]][p[1]], line);

        // Check if all symbols in line are non-null and mutually equal
        // If so, this is a match, so return the match
        // Otherwise, this is not a match, so continue searching
        // TODO: Extract "all equal" logic to separate function
        const isMatch: boolean = R.all(s => s !== null, lineSymbols)
          && R.reduce(
            (acc: {equal: boolean; prev: Symbol | null;}, elem: Symbol | null) => ({
              equal: acc.equal && (acc.prev === null || elem === acc.prev),
              prev: elem
            }),
            {
              prev: null,
              equal: true,
            },
            lineSymbols,
          )
            .equal;
        if (isMatch) {
          return line;
        }
      }
    }
  }

  return null;
}

function isBoardCompletelyFilled(board: Board): boolean {
  return R.all(symbol => symbol !== null, R.flatten(board));
}

function reducer(draft: State, action: Action): void {
  switch (action.type) {
    case "start-game":
      draft.board = initialBoard;
      draft.status = {
        type: "playing",
        currentPlayer: Math.random() >= 0.5 ? "X" : "O",
      };
      return;
    case "take-turn":
      if (draft.status.type === "playing" && draft.board[action.coords[0]][action.coords[1]] === null) {
        draft.board[action.coords[0]][action.coords[1]] = draft.status.currentPlayer;

        const match = findMatch(draft.board);
        if (match !== null) {
          draft.status = {
            type: "win",
            winningPlayer: draft.status.currentPlayer,
            match,
          }
        } else {
          if (isBoardCompletelyFilled(draft.board)) {
            draft.status = { type: "draw" };
          } else {
            if (draft.status.currentPlayer === "X") {
              draft.status.currentPlayer = "O";
            } else if (draft.status.currentPlayer === "O") {
              draft.status.currentPlayer = "X";
            }
          }
        }
      }

      return;
  }
}

function symbolToIcon(symbol: Symbol): IconType {
  switch (symbol) {
    case "X":
      return CgClose;
    case "O":
      return CgShapeCircle;
  }
}

function App() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  let statusText: JSX.Element;
  switch (state.status.type) {
    case "not-started":
      statusText = <>Press <i>Start Game</i> to begin!</>;
      break;
    case "playing":
      const CurrentPlayerIcon = symbolToIcon(state.status.currentPlayer);
      statusText = <><CurrentPlayerIcon className="inline-block" />'s turn</>;
      break;
    case "win":
      const WinningPlayerIcon = symbolToIcon(state.status.winningPlayer);
      statusText = <><WinningPlayerIcon className="inline-block" /> wins!</>;
      break;
    case "draw":
      statusText = <>It's a draw!</>;
      break;
    default:
      statusText = <></>;
      break;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-700 gap-4">
      <p className="text-white justify-self-end">{statusText}</p>
      <div className="border-2 border-gray-500 bg-gray-900 text-white grid grid-cols-3 grid-rows-3 gap-2 rounded-2xl shadow-2xl">
        {state.board.map((row, rowIndex) => row.map((symbol, cellIndex) => (
          <div
            key={`${rowIndex},${cellIndex}`}
            className="h-20 w-20 flex items-center justify-center text-4xl cursor-pointer"
            onClick={() => dispatch({ type: "take-turn", coords: [rowIndex, cellIndex] })}
          >
            {/*TODO: Will make this nicer soon!*/}
            {symbol !== null && React.createElement(symbolToIcon(symbol), null)}
          </div>
        )))}
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => dispatch({ type: "start-game" })}
      >
        Start game
      </button>
    </div>
  );
}

export default App;
