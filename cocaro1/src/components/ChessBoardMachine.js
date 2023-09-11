import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as roomSlice from "../redux/reducer/roomSlice";
import useCutomeHook from "../contants/useCustomerHook";

const ROWS = 16;
const COLS = 16;
const WIN_LENGTH = 5;
const BOARD_DEFAULT = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => null)
);
const EMPTY = null;
const PLAYER = "X";
const AI_PLAYER = "O";

export default function ChessBoardMachine({ rooms, users }) {
  const { userLogin } = useCutomeHook();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const room = rooms.find((room) => room.id === parseInt(id));
  const [board, setBoard] = useState([...BOARD_DEFAULT]);
  const [disable, setDisable] = useState(false);
  const { t } = useTranslation();

  const calculateWinner = (currentBoard) => {
    const directions = [
      [0, 1], // check hàng ngang
      [1, 0], // check hàng dọc
      [1, 1], // đường chéo trái xuống phải
      [-1, 1], // đường chéo phải xuống trái
    ];

    const checkWin = (row, col, dirX, dirY) => {
      const player = currentBoard[row][col];
      if (!player) return false;
      for (let i = 1; i < WIN_LENGTH; i++) {
        const newRow = row + dirY * i;
        const newCol = col + dirX * i;
        if (
          newRow < 0 ||
          newRow >= ROWS ||
          newCol < 0 ||
          newCol >= COLS ||
          currentBoard[newRow][newCol] !== player
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
            return currentBoard[row][col] === PLAYER ? PLAYER : AI_PLAYER;
          }
        }
      }
    }

    return null;
  };

  const winner = calculateWinner(board);

  useEffect(() => {
    if (winner) {
      toast.success(
        `${winner === PLAYER ? t("player") : t("ai")} ${t("wins")}`
      );
      setDisable(true);
    }
  }, [winner]);

  useEffect(() => {
    if (room) {
      setBoard(room?.dataChess);
    }
  }, [room]);

  const handleClick = (row, col) => {
    if (board[row][col] || winner || disable) {
      return;
    }

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = PLAYER;
    setBoard(newBoard);
    dispatch(
      roomSlice.updateRoom({
        ...room,
        currentUserId: userLogin?.id,
        dataChess: newBoard,
      })
    );

    if (!isBoardFull(newBoard)) {
      makeAIMove(newBoard);
    }
  };

  const isBoardFull = (currentBoard) => {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (currentBoard[row][col] === EMPTY) {
          return false;
        }
      }
    }
    return true;
  };

  const makeAIMove = (currentBoard) => {
    if (disable || isBoardFull(currentBoard)) {
      return;
    }
    setTimeout(() => {
      const availableMoves = [];
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (currentBoard[row][col] === EMPTY) {
            availableMoves.push({ row, col });
          }
        }
      }
      const randomMove =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      const newBoard = [...currentBoard];
      newBoard[randomMove.row][randomMove.col] = AI_PLAYER;
      setBoard(newBoard);
      dispatch(
        roomSlice.updateRoom({
          ...room,
          currentUserId: userLogin?.id,
          dataChess: newBoard,
        })
      );
    }, 200);
  };

  const renderSquare = (row, col) => (
    <button
      className={`square ${board[row][col] === PLAYER ? "black" : "red"}`}
      onClick={() => handleClick(row, col)}
    >
      {board[row][col]}
    </button>
  );

  const renderBoard = () =>
    board.map((row, rowIndex) => (
      <div key={rowIndex} className="board-row">
        {row.map((_, colIndex) => renderSquare(rowIndex, colIndex))}
      </div>
    ));

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
                className="btn btn-success btn-rounded mb-3 w-100"
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
          {/* <div className="text-light text-center">{status}</div> */}
        </div>
        <div className="game-board">{renderBoard()}</div>
      </div>
    </div>
  );
}
