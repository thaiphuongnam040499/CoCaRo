import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import socketIOClient from "socket.io-client";
import { findAllRoom, updateRoom } from "../redux/reducer/roomSlice";
import { useParams } from "react-router-dom";
import { findAllUser } from "../redux/reducer/userSlice";

const host = "http://localhost:4002";
const ROWS = 16;
const COLS = 16;
const WIN_LENGTH = 5;

export default function ChessBoard() {
  const [board, setBoard] = useState(Array(ROWS).fill(Array(COLS).fill(null)));
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.room.listRoom);
  const users = useSelector((state) => state.user.listUser);
  const { id } = useParams();
  const room = rooms.find((room) => room.id === parseInt(id));
  const socketRef = useRef();
  const [seconds, setSeconds] = useState(60);
  const [disable, setDisable] = useState({
    oner: false,
    player: false,
  });

  const userPlayer = users.find((user) => user.id === room?.playerId);
  const userOner = users.find((user) => user.id === room?.userId);

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on("sendDataServer", (dataGot) => {
      setBoard(dataGot.data);
    });
    socketRef.current.on("sendDisableServer", (dataGot) => {
      setDisable({
        oner: dataGot.data,
        player: !dataGot.data,
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (room) {
      setBoard(room.dataChess); // Lấy dữ liệu dataChess từ room
    }
  }, [room]);

  const timeOut = () => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    if (seconds === 0) {
      return () => clearInterval(interval);
    }
  };

  const handleClick = (row, col) => {
    if (board[row][col] || calculateWinner(board) || winner) {
      return;
    }
    const newBoard = board.map((r, indexR) =>
      indexR === row
        ? r.map((c, indexC) =>
            indexC === col ? (room.userId === userLogin.id ? "X" : "O") : c
          )
        : r
    );
    if (!room) return;
    const checkDisable = room?.currentUserId === userLogin.id ? true : false;
    socketRef.current.emit("sendDisableClient", checkDisable);
    socketRef.current.emit("sendDataClient", newBoard);
    dispatch(
      updateRoom({
        ...room,
        currentUserId: userLogin.id,
        dataChess: newBoard,
      })
    );
  };

  const renderSquare = (row, col) => (
    <button
      disabled={
        room?.currentUserId === userLogin.id ? disable.oner : disable.player
      }
      className="square"
      onClick={() => handleClick(row, col)}
    >
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

  const winner = calculateWinner(board, userOner, userPlayer);

  const status = winner
    ? `Winner: ${winner.username}`
    : `Luot tiep theo: ${room?.currentUserId === room?.userId ? "X" : "O"}`;
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
function calculateWinner(board, userOner, userPlayer) {
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
        const playerOner = board[row][col] === "X" ? userOner : userPlayer;
        const playerPlayer = board[row][col] === "O" ? userPlayer : userOner;
        if (checkWin(row, col, dirX, dirY)) {
          return playerOner;
        } else if (checkWin(row, col, dirX, dirY)) {
          return playerPlayer;
        }
      }
    }
  }
  return null;
}
