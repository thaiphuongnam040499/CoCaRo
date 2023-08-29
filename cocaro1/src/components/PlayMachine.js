import React, { useEffect, useState } from "react";
import "../../src/assets/board.css";

const ROWS = 16;
const COLS = 16;
const WIN_LENGTH = 5;

const EMPTY_CELL = null;

export default function PlayMachine() {
  const [board, setBoard] = useState(
    Array(ROWS).fill(Array(COLS).fill(EMPTY_CELL))
  );
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const AIPlayer = "O";

  useEffect(() => {
    if (currentPlayer === AIPlayer) {
      const bestMove = findBestMove(board);
      if (bestMove) {
        setTimeout(() => {
          makeMove(bestMove.row, bestMove.col);
        }, 500);
      }
    }
  }, [board, currentPlayer]);

  const handleClick = (row, col) => {
    if (!board[row][col] && currentPlayer !== AIPlayer) {
      makeMove(row, col);
    }
  };

  const makeMove = (row, col) => {
    const newBoard = board.map((r, rowIndex) =>
      rowIndex === row
        ? [...r.slice(0, col), currentPlayer, ...r.slice(col + 1)]
        : r
    );
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };
  const calculateWinner = (squares) => {
    const lines = [
      // Các dòng ngang có thể thắng
      [0, 1, 2, 3, 4, 5],
      [1, 2, 3, 4, 5, 6],
      [2, 3, 4, 5, 6, 7],
      [3, 4, 5, 6, 7, 8],
      // Các dòng dọc có thể thắng
      [0, 6, 12, 18, 24, 30],
      [6, 12, 18, 24, 30, 36],
      [12, 18, 24, 30, 36, 42],
      [1, 7, 13, 19, 25, 31],
      // Các đường chéo có thể thắng
      [0, 7, 14, 21, 28, 35],
      [6, 13, 20, 27, 34, 41],
      [5, 12, 19, 26, 33, 40],
      [4, 11, 18, 25, 32, 39],
    ];

    for (const line of lines) {
      const [a, b, c, d, e, f] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c] &&
        squares[a] === squares[d] &&
        squares[a] === squares[e] &&
        squares[a] === squares[f]
      ) {
        return squares[a];
      }
    }

    return null; // Không có người chiến thắng
  };

  const minimax = (board, depth, isMaximizingPlayer) => {
    const winner = calculateWinner(board);

    if (winner === AIPlayer) {
      return { score: 10 - depth };
    }
    if (winner === "X") {
      return { score: depth - 10 };
    }
    if (board.every((cell) => cell !== EMPTY_CELL)) {
      return { score: 0 };
    }

    if (isMaximizingPlayer) {
      let bestScore = -Infinity;
      let bestMove = null;
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (!board[row][col]) {
            board[row][col] = AIPlayer;
            const score = minimax(board, depth + 1, false).score;
            board[row][col] = EMPTY_CELL;
            if (score > bestScore) {
              bestScore = score;
              bestMove = { row, col };
            }
          }
        }
      }
      return { score: bestScore, move: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove = null;
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (!board[row][col]) {
            board[row][col] = "X";
            const score = minimax(board, depth + 1, true).score;
            board[row][col] = EMPTY_CELL;
            if (score < bestScore) {
              bestScore = score;
              bestMove = { row, col };
            }
          }
        }
      }
      return { score: bestScore, move: bestMove };
    }
  };

  const findBestMove = (board) => {
    const bestMove = minimax(board, 0, true);
    return bestMove.move;
  };

  const renderSquare = (row, col) => (
    <button className="square" onClick={() => handleClick(row, col)}>
      <span
        style={{
          color: board[row][col] === "X" ? "black" : "red",
        }}
      >
        {board[row][col]}
      </span>
    </button>
  );

  const renderBoard = () =>
    board.map((row, rowIndex) => (
      <div key={rowIndex} className="board-row">
        {row.map((_, colIndex) => renderSquare(rowIndex, colIndex))}
      </div>
    ));

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="game">
        <div className="game-info">
          {/* <div className="text-light text-center">{status}</div> */}
        </div>
        <div className="game-board">{renderBoard()}</div>
      </div>
    </div>
  );
}
