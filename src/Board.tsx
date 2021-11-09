import React from "react";
import classNames from "classnames";
import * as R from "ramda";
import BoardType from "./boardType";
import Status from "./status";
import {symbolToIcon} from "./symbol";
import Point from "./point";

interface Props {
  board: BoardType;
  takeTurn: (point: Point) => void;
  status: Status;
}

function Board({
  board,
  takeTurn,
  status,
}: Props) {
  return (
    <div className="border-2 border-gray-500 bg-gray-900 text-white grid grid-cols-3 grid-rows-3 gap-2 rounded-2xl shadow-2xl">
      {board.map((row, rowIndex) => row.map((symbol, cellIndex) => (
        <div
          key={`${rowIndex},${cellIndex}`}
          className={classNames(
            "h-20 w-20 flex items-center justify-center text-4xl",
            {
              "cursor-pointer": status.type === "playing" && board[rowIndex][cellIndex] === null,
              "text-blue-500 animate-pulse": status.type === "win" && R.includes([rowIndex, cellIndex], status.match),
            },
          )}
          onClick={() => takeTurn([rowIndex, cellIndex])}
        >
          {/*TODO: Will make this nicer soon!*/}
          {symbol !== null && React.createElement(symbolToIcon(symbol), null)}
        </div>
      )))}
    </div>
  );
}

export default Board;
