import React from "react";
import {useImmerReducer} from "use-immer";
import * as R from "ramda";
import Board from "./Board";
import BoardType from "./boardType";
import Point from "./point";
import Symbol, {symbolToIcon} from "./symbol";
import Status from "./status";
import GameMode from "./gameMode";
import produce from "immer";

interface State {
  board: BoardType;
  status: Status;
  firstPlayer: Symbol;
}

type Action =
  | { type: "reset-game" }
  | { type: "take-turn", coords: Point, gameMode: GameMode };

interface Match {
  points: Point[];
  symbol: Symbol;
}

const gridSize: Point = [3, 3];
const matchLength: number = 3;

const initialBoard: BoardType = R.repeat(R.repeat(null, gridSize[1]), gridSize[0]);
const initialState = (): State => {
  const firstPlayer = Math.random() >= 0.5 ? "X" : "O";
  return ({
    board: initialBoard,
    status: {
      type: "playing",
      currentPlayer: firstPlayer,
    },
    firstPlayer,
  });
};

function findMatch(board: BoardType): Match | null {
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
              equal: acc.prev === null || (acc.equal && elem === acc.prev),
              prev: elem
            }),
            {
              prev: null,
              equal: false,
            },
            lineSymbols,
          )
            .equal;
        if (isMatch) {
          return {
            points: line,
            symbol: R.head(lineSymbols)!,
          };
        }
      }
    }
  }

  return null;
}

function isBoardCompletelyFilled(board: BoardType): boolean {
  return R.all(symbol => symbol !== null, R.flatten(board));
}

function getOpponent(player: Symbol): Symbol {
  switch (player) {
    case "X":
      return "O";
    case "O":
      return "X";
  }
}

function computeStatus(board: BoardType, currentPlayer: Symbol): Status {
  const match = findMatch(board);
  if (match !== null) {
    return {
      type: "win",
      winningPlayer: match.symbol,
      match: match.points,
    }
  } else {
    if (isBoardCompletelyFilled(board)) {
      return { type: "draw" };
    } else {
      return {
        type: "playing",
        currentPlayer: getOpponent(currentPlayer),
      }
    }
  }
}

function computeScore(board: BoardType, currentPlayer: Symbol): number {
  const result = computeStatus(board, currentPlayer);
  if (result.type === "win" && result.winningPlayer === currentPlayer) {
    return 10;
  } else if (result.type === "win" && result.winningPlayer !== currentPlayer) {
    return -10;
  } else {
    return 0;
  }
}

interface Move {
  point?: Point;
  score: number;
}

function minimax(board: BoardType, currentPlayer: Symbol, aiPlayer: Symbol): Move {
  if (computeStatus(board, currentPlayer).type !== "playing") {
    return {
      score: computeScore(board, aiPlayer),
    };
  }

  const allPoints: Point[] = R.xprod(R.range(0, gridSize[0]), R.range(0, gridSize[1]));
  const emptyPoints: Point[] = R.filter(point => board[point[0]][point[1]] === null, allPoints);
  // For each of the available moves,
  const moves: Move[] = R.map(point => {
    const newBoard = produce(board, draftBoard => {
      draftBoard[point[0]][point[1]] = currentPlayer;
    })

    return ({
      point,
      score: minimax(newBoard, getOpponent(currentPlayer), aiPlayer).score,
    });
  }, emptyPoints);

  if (currentPlayer === aiPlayer) {
    return R.reduce(R.maxBy((move: Move) => move.score), {score: -Infinity}, moves);
  } else {
    return R.reduce(R.minBy((move: Move) => move.score), {score: Infinity}, moves);
  }
}

function reducer(draft: State, action: Action): State | void {
  const takeTurn = (coords: Point) => {
    if (draft.status.type === "playing" && draft.board[coords[0]][coords[1]] === null) {
      draft.board[coords[0]][coords[1]] = draft.status.currentPlayer;

      draft.status = computeStatus(draft.board, draft.status.currentPlayer);
    }
  };

  const takeTurnAi = (): void => {
    if (draft.status.type === "playing") {
      const move = minimax(draft.board, draft.status.currentPlayer, getOpponent(draft.firstPlayer));
      if (move.point !== undefined) {
        takeTurn(move.point);
      }
    }
  };

  switch (action.type) {
    case "reset-game":
      return initialState();
    case "take-turn":
      takeTurn(action.coords);

      if (action.gameMode === "player-vs-ai") {
        takeTurnAi();
      }

      return;
  }
}

interface Props {
  gameMode: GameMode;
  navigateToMenu: () => void;
}

function Game({ gameMode, navigateToMenu }: Props) {
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
        takeTurn={point => dispatch({ type: "take-turn", coords: point, gameMode })}
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
