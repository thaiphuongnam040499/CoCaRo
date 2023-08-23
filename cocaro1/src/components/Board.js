// Board.js

import React from "react";
import Square from "./Square";
import "../../src/assets/board.css";

export default function Board({ squares, onClick }) {
  const renderSquares = (numbs) => {
    return numbs.map((num) => (
      <Square key={num} value={squares[num]} onClick={() => onClick(num)} />
    ));
  };

  return (
    <div>
      <div className="board-row">
        {renderSquares([0, 1, 2, 3, 4, 5, 6, 7, 8])}
      </div>
      <div className="board-row">
        {renderSquares([9, 10, 11, 12, 13, 14, 15, 16, 17])}
      </div>
      <div className="board-row">
        {renderSquares([18, 19, 20, 21, 22, 23, 24, 25, 26])}
      </div>
      <div className="board-row">
        {renderSquares([27, 28, 29, 30, 31, 32, 33, 34, 35])}
      </div>
      <div className="board-row">
        {renderSquares([36, 37, 38, 39, 40, 41, 42, 43, 44])}
      </div>
      <div className="board-row">
        {renderSquares([45, 46, 47, 48, 49, 50, 51, 52, 53])}
      </div>
      <div className="board-row">
        {renderSquares([54, 55, 56, 57, 58, 59, 60, 61, 62])}
      </div>
      <div className="board-row">
        {renderSquares([63, 64, 65, 66, 67, 68, 69, 70, 71])}
      </div>
    </div>
  );
}
