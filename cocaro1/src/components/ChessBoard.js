import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import socketIOClient from "socket.io-client";
import * as roomSlice from "../redux/reducer/roomSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import useCutomeHook from "../contants/useCustomerHook";

const host = "http://localhost:4002";
const ROWS = 16;
const COLS = 16;
const WIN_LENGTH = 5;
const BOARD_DEFAULT = Array(ROWS).fill(Array(COLS).fill(null));
const LOCAL_STORAGE_KEY = "gameTime";

export default function ChessBoard({ rooms, users }) {
  const [board, setBoard] = useState(Array(ROWS).fill(Array(COLS).fill(null)));
  const { userLogin } = useCutomeHook();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const room = rooms.find((room) => room.id === parseInt(id));
  const { t } = useTranslation();
  const socketRef = useRef();
  const [gameTime, setGameTime] = useState(15);
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
    socketRef.current.on("sendGameTimeServer", (dataGot) => {
      setGameTime(dataGot.data);
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
    const savedGameTime = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedGameTime !== null) {
      setGameTime(parseInt(savedGameTime, 10) - 2);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, gameTime.toString());
    socketRef.current.emit("sendGameTimeClient", gameTime);
    const gameTimeInterval = setInterval(() => {
      if (!winner) {
        if (
          (disable.oner && !disable.player) ||
          (!disable.oner && disable.player)
        ) {
          setGameTime((prev) => prev - 1);
        }
      }
    }, 1000);

    if (!winner) {
      if (gameTime === 0) {
        if (disable.oner && !disable.player) {
          alert(`${userPlayer?.username} thua cuoc`);
          clearInterval(gameTimeInterval);
        } else {
          alert(`${userOner?.username} thua cuoc`);
          clearInterval(gameTimeInterval);
        }
      }
    }
    return () => {
      clearInterval(gameTimeInterval);
    };
  }, [disable, gameTime]);

  const handleClick = async (row, col) => {
    if (board[row][col] || calculateWinner(board) || winner) {
      return;
    }
    setGameTime(15);
    const newBoard = board.map((r, indexR) =>
      indexR === row
        ? r.map((c, indexC) =>
            indexC === col ? (room?.userId === userLogin?.id ? "X" : "O") : c
          )
        : r
    );
    if (!room) return;
    const checkDisable = room.currentUserId === userLogin?.id ? true : false;
    socketRef.current.emit("sendDisableClient", checkDisable);
    socketRef.current.emit("sendDataClient", newBoard);
    dispatch(
      roomSlice.updateRoom({
        ...room,
        currentUserId: userLogin?.id,
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
    ? `${t("winner")}: ${winner.username}`
    : `${t("next")}: ${
        disable.oner === true
          ? `${userPlayer?.username}`
          : `${userOner?.username}`
      }  ${gameTime} ${t("seconds")}`;

  const roomFind = rooms.find((room) => room.id === parseInt(id));

  const handleOutRoom = () => {
    if (roomFind && userLogin) {
      dispatch(roomSlice.deleteRoom(roomFind?.id));
      localStorage.removeItem("gameTime");
      navigate("/home");
    } else {
      navigate("/home");
    }
  };

  const handleChangeStatus = () => {
    if (roomFind?.status) {
      dispatch(
        roomSlice.updateRoom({
          ...roomFind,
          status: false,
        })
      );
    } else {
      dispatch(
        roomSlice.updateRoom({
          ...roomFind,
          status: true,
        })
      );
    }
  };

  const handlePlayAgain = () => {
    dispatch(
      roomSlice.updateRoom({
        ...roomFind,
        dataChess: BOARD_DEFAULT,
        currentUserId: room?.userId,
      })
    );
    localStorage.removeItem("gameTime");
    setGameTime(15);
    setDisable({
      oner: false,
      player: false,
    });
    dispatch(roomSlice.findAllRoom());
  };

  const handleClickBtn = () => {
    toast((h) => (
      <span>
        {t("playAgain")} ?
        <button className="btn btn-danger ms-2" onClick={handlePlayAgain}>
          {t("playAgain")}
        </button>
      </span>
    ));
  };

  const handleGiveIn = () => {
    setDisable({
      oner: true,
      player: true,
    });
  };

  const handleClickGiveIn = () => {
    toast((h) => (
      <span>
        {t("giveIn")} ?
        <button className="btn btn-danger ms-2" onClick={handleGiveIn}>
          {t("giveIn")}
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
                  {t("ready")}
                </button>
              ) : (
                <button
                  onClick={handleChangeStatus}
                  className="btn btn-warning btn-rounded mb-3 w-100"
                >
                  {t("unReady")}
                </button>
              )}
            </div>
            <div className="me-2">
              <button
                onClick={handleClickBtn}
                className="btn btn-info btn-rounded mb-3 w-100"
              >
                {t("playAgain")}
              </button>
            </div>
            <div className="me-2">
              <button
                onClick={handleClickGiveIn}
                className="btn btn-warning btn-rounded mb-3 w-100"
              >
                {t("giveIn")}
              </button>
            </div>
            <div className="me-2">
              <button
                onClick={handleOutRoom}
                className="btn btn-danger btn-rounded mb-3 w-100"
              >
                {t("exits")}
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
