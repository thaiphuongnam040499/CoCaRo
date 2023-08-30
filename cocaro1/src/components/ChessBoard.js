import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import socketIOClient from "socket.io-client";
import {
  deleteRoom,
  findAllRoom,
  updateRoom,
} from "../redux/reducer/roomSlice";
import { useNavigate, useParams } from "react-router-dom";
import { findAllUser } from "../redux/reducer/userSlice";
import { Toaster, toast } from "react-hot-toast";
import store from "../redux/store";

const host = "http://localhost:4002";
const ROWS = 16;
const COLS = 16;
const WIN_LENGTH = 5;
const BOARD_DEFAULT = Array(ROWS).fill(Array(COLS).fill(null));

export default function ChessBoard({ rooms, users }) {
  const [board, setBoard] = useState(Array(ROWS).fill(Array(COLS).fill(null)));
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const room = rooms.find((room) => room.id === parseInt(id));

  const socketRef = useRef();
  const [onerTime, setOnerTime] = useState(15);
  const [playerTime, setPlayerTime] = useState(15);
  const [onerLost, setOnerLost] = useState(false);
  const [playerLost, setPlayerLost] = useState(false);
  const [disable, setDisable] = useState({
    oner: false,
    player: false,
  });
  const userPlayer = users.find((user) => user.id === room?.playerId);
  const userOner = users.find((user) => user.id === room?.userId);
  const winner = calculateWinner(board, userOner, userPlayer);

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
      setBoard(room.dataChess);
    }
  }, [room]);

  useEffect(() => {
    const onerInterval = setInterval(() => {
      if (disable.oner && !disable.player && onerTime > 0) {
        setPlayerTime((prevTime) => prevTime - 1);
        setOnerTime(15);
      }
    }, 1000);

    const playerInterval = setInterval(() => {
      if (disable.player && !disable.oner && playerTime > 0) {
        setOnerTime((prevTime) => prevTime - 1);
        setPlayerTime(15);
      }
    }, 1000);
    if (!winner) {
      if (playerTime === 0 && !playerLost) {
        clearInterval(playerInterval);
        setPlayerLost(true);
        alert(`${userPlayer?.username} thua cuoc`);
        setDisable({
          oner: true,
          player: true,
        });
      }

      if (onerTime === 0 && !onerLost) {
        clearInterval(onerInterval);
        setOnerLost(true);
        alert(`${userOner?.username} thua cuoc`);
        setDisable({
          oner: true,
          player: true,
        });
      }
    }
    return () => {
      clearInterval(onerInterval);
      clearInterval(playerInterval);
    };
  }, [disable, onerTime, playerTime, onerLost, playerLost]);

  const handleClick = async (row, col) => {
    if (board[row][col] || calculateWinner(board) || winner) {
      toast.success(`${winner.username} chien thang. Ban thua cuoc`);
      return;
    }
    const newBoard = board.map((r, indexR) =>
      indexR === row
        ? r.map((c, indexC) =>
            indexC === col ? (room?.userId === userLogin.id ? "X" : "O") : c
          )
        : r
    );
    if (!room) return;
    const checkDisable = room.currentUserId === userLogin.id ? true : false;
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

  const status = winner
    ? `Winner: ${winner.username}`
    : `Luot tiep theo: ${
        disable.oner ? `${userPlayer?.username}` : `${userOner?.username}`
      } - ${disable.oner ? playerTime : onerTime} seconds`;

  const roomFind = rooms.find((room) => room.id === parseInt(id));

  const handleOutRoom = () => {
    if (roomFind && userLogin) {
      dispatch(deleteRoom(roomFind?.id));
      navigate("/home");
    } else {
      navigate("/home");
    }
  };

  const handleChangeStatus = () => {
    if (roomFind?.status) {
      dispatch(
        updateRoom({
          ...roomFind,
          status: false,
        })
      );
    } else {
      dispatch(
        updateRoom({
          ...roomFind,
          status: true,
        })
      );
    }
  };

  const handlePlayAgain = () => {
    dispatch(
      updateRoom({
        ...roomFind,
        dataChess: BOARD_DEFAULT,
        currentUserId: userLogin.id,
      })
    );
    setDisable({
      oner: false,
      player: false,
    });
    dispatch(findAllRoom());
    setOnerTime(15);
    setPlayerTime(15);
    setOnerLost(false);
    setPlayerLost(false);
  };

  const handleClickBtn = () => {
    toast((t) => (
      <span>
        Ban co muon choi lai
        <button className="btn btn-danger ms-2" onClick={handlePlayAgain}>
          Choi lai
        </button>
      </span>
    ));
  };

  const handleGiveIn = () => {
    setDisable({
      oner: true,
      player: true,
    });
    setOnerTime(15);
    setPlayerTime(15);
    setOnerLost(false);
    setPlayerLost(false);
  };

  const handleClickGiveIn = () => {
    toast((t) => (
      <span>
        Ban chac chan dau hang
        <button className="btn btn-danger ms-2" onClick={handleGiveIn}>
          Dau hang
        </button>
      </span>
    ));
  };

  return (
    <div className="d-flex justify-content-center align-items-center ">
      <Toaster />
      <div className="game">
        <div className="game-info">
          <div className="d-flex justify-content-center">
            <div className="me-2">
              {roomFind?.status ? (
                <button
                  onClick={handleChangeStatus}
                  className="btn btn-success btn-rounded mb-3 w-100"
                >
                  San sang
                </button>
              ) : (
                <button
                  onClick={handleChangeStatus}
                  className="btn btn-warning btn-rounded mb-3 w-100"
                >
                  Huy san sang
                </button>
              )}
            </div>
            <div className="me-2">
              <button
                onClick={handleClickBtn}
                className="btn btn-info btn-rounded mb-3 w-100"
              >
                Choi lai
              </button>
            </div>
            <div className="me-2">
              <button
                onClick={handleClickGiveIn}
                className="btn btn-warning btn-rounded mb-3 w-100"
              >
                Dau hang
              </button>
            </div>
            <div className="me-2">
              <button
                onClick={handleOutRoom}
                className="btn btn-danger btn-rounded mb-3 w-100"
              >
                Roi phong
              </button>
            </div>
          </div>
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
