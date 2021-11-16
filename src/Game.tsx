import React from "react";
import {useImmerReducer} from "use-immer";
import * as R from "ramda";
import Board from "./Board";
import BoardType from "./boardType";
import Point from "./point";
import Symbol, {symbolToIcon} from "./symbol";
import Status from "./status";

interface State {
  board: BoardType;
  status: Status;
}

type Action =
  | { type: "reset-game" }
  | { type: "take-turn", coords: Point };

const gridSize: Point = [3, 3];
const matchLength: number = 3;

const initialBoard: BoardType = R.repeat(R.repeat(null, gridSize[1]), gridSize[0]);
const initialState = (): State => ({
  board: initialBoard,
  status: {
    type: "playing",
    currentPlayer: Math.random() >= 0.5 ? "X" : "O",
  },
});

function findMatch(board: BoardType): Point[] | null {
  const directions: Point[] = [
    [0, 1], // Horizontal
    [1, 0], // Vertical
    [1, 1], // Diagonally down
    [-1, 1], // Diagonally up
  ];

  for (const direction of directions) {
    const minRowIndex = Math.max(0, (matchLength * -direction[0]) - 1);
    const maxRowIndex = gridSize[0] - Math.max(1, matchLength * direction[0]);

    for (let rowIndex = minRowIndex; rowIndex <= maxRowIndex; rowIndex++) {
      const minColumnIndex = Math.max(0, (matchLength * -direction[1]) - 1);
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

function isBoardCompletelyFilled(board: BoardType): boolean {
  return R.all(symbol => symbol !== null, R.flatten(board));
}

function reducer(draft: State, action: Action): State | void {
  switch (action.type) {
    case "reset-game":
      return initialState();
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

interface Props {
  navigateToMenu: () => void;
}

function Game({ navigateToMenu }: Props) {
  const [state, dispatch] = useImmerReducer(reducer, initialState());

  let statusText: JSX.Element;
  switch (state.status.type) {
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
    <>
      <p className="justify-self-end">{statusText}</p>
      <Board
        board={state.board}
        takeTurn={point => dispatch({ type: "take-turn", coords: point })}
        status={state.status}
      />
      <div className="flex gap-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
          onClick={() => dispatch({ type: "reset-game" })}
        >
          Reset game
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
          onClick={navigateToMenu}
        >
          Back to menu
        </button>
      </div>
    </>
  );
}

export default Game;
