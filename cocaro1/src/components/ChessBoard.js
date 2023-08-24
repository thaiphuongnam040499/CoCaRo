import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findAllRoom } from "../redux/reducer/roomSlice";
import socketIOClient from "socket.io-client";

const host = "http://localhost:4002";
const ROWS = 16;
const COLS = 16;
const WIN_LENGTH = 5;

export default function ChessBoard() {
  const [board, setBoard] = useState(Array(ROWS).fill(Array(COLS).fill(null)));
  const [xIsNext, setXIsNext] = useState(true);
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const rooms = useSelector((state) => state.room.listRoom);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(findAllRoom());
  }, []);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on("sendDataServer", (dataGot) => {
      setBoard(dataGot.data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleClick = (row, col) => {
    if (board[row][col] || calculateWinner(board)) {
      return;
    }
    const newBoard = board.map((r, indexR) =>
      indexR === row
        ? r.map((c, indexC) => (indexC === col ? (xIsNext ? "X" : "O") : c))
        : r
    );
    socketRef.current.emit("sendDataClient", newBoard);
    setXIsNext(!xIsNext);
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

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;
  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="game">
        <div className="game-info">
          <div className="text-light text-center">{status}</div>
        </div>
        <div className="game-board">{renderBoard()}</div>
      </div>
    </div>
  );
}
function calculateWinner(board) {
  const directions = [
    [0, 1], // check hang ngang
    [1, 0], // check hang doc
    [1, 1], // duong cheo trai xuong phai
    [-1, 1], // duong cheo phai xuong trai
  ];

  const checkWin = (row, col, dirX, dirY) => {
    const player = board[row][col];
    if (!player) return false;

    for (let i = 1; i < WIN_LENGTH; i++) {
      const newRow = row + dirY * i;
      const newCol = col + dirX * i;
      if (
        newRow < 0 ||
        newRow >= ROWS ||
        newCol < 0 ||
        newCol >= COLS ||
        board[newRow][newCol] !== player
      ) {
        return false;
      }
    }
    return true;
  };

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      for (const [dirX, dirY] of directions) {
        if (checkWin(row, col, dirX, dirY)) {
          return board[row][col];
        }
      }
    }
  }

  return null;
}
