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

const MAP_SCORE_COMPUTER = new Map([
  [5, Infinity],
  [4, 2000],
  [3, 500],
  [2, 300],
  [1, 100],
]);
const MAP_POINT_HUMAN = new Map([
  [4, 999999],
  [3, 1000],
  [2, 400],
  [1, 10],
  [0, 0],
]);

export default function ChessBoardMachine({ rooms, users }) {
  const { userLogin } = useCutomeHook();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const room = rooms.find((room) => room.id === parseInt(id));
  const [board, setBoard] = useState([...BOARD_DEFAULT]);
  const [disable, setDisable] = useState(false);
  const { t } = useTranslation();
  const [lastMove, setLastMove] = useState(null);
  const [lastMoveByAI, setLastMoveByAI] = useState(null);

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
        `${winner === PLAYER ? t("player") : t("computer")} ${t("win")}`
      );
      setDisable(true);
    }
  }, [winner]);

  useEffect(() => {
    if (room) {
      setBoard(room?.dataChess);
    }
  }, [room]);

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

  const handleClick = (row, col) => {
    if (board[row][col] || winner) {
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
    setLastMove({ row, col });
    if (!isBoardFull(newBoard)) {
      makeAIMove(newBoard);
    }
  };

  const makeAIMove = (currentBoard) => {
    if (isBoardFull(currentBoard) || winner) {
      return;
    }
    if (!winner) {
      // Tạo một danh sách chứa tất cả vị trí của ô X trên bảng
      const xPositions = [];
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (currentBoard[row][col] === PLAYER) {
            xPositions.push({ row, col });
          }
        }
      }

      // Tạo một danh sách các ô có điểm số tốt nhất cho máy tính
      const bestMoves = [];

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (currentBoard[row][col] === null) {
            // Tạo một bản sao của bảng hiện tại để kiểm tra
            const tempBoard = currentBoard.map((r) => [...r]);
            tempBoard[row][col] = AI_PLAYER;

            // Kiểm tra nếu máy tính có thể thắng sau bước này
            if (calculateWinner(tempBoard) === AI_PLAYER) {
              currentBoard[row][col] = AI_PLAYER;
              setBoard([...currentBoard]);
              dispatch(
                roomSlice.updateRoom({
                  ...room,
                  currentUserId: userLogin?.id,
                  dataChess: currentBoard,
                })
              );
              setLastMoveByAI({ row, col });
              return;
            }

            // Kiểm tra nếu người chơi có cơ hội thắng sau bước này và chặn nó
            tempBoard[row][col] = PLAYER;
            if (calculateWinner(tempBoard) === PLAYER) {
              currentBoard[row][col] = AI_PLAYER;
              setBoard([...currentBoard]);
              dispatch(
                roomSlice.updateRoom({
                  ...room,
                  currentUserId: userLogin?.id,
                  dataChess: currentBoard,
                })
              );
              setLastMoveByAI({ row, col });
              return;
            }

            // Tính điểm cho nước đi này
            let score =
              MAP_SCORE_COMPUTER.get(
                Math.max(
                  getHorizontal(row, col, AI_PLAYER),
                  getVertical(row, col, AI_PLAYER),
                  getRightDiagonal(row, col, AI_PLAYER),
                  getLeftDiagonal(row, col, AI_PLAYER)
                )
              ) +
              MAP_POINT_HUMAN.get(
                Math.max(
                  getHorizontal(row, col, PLAYER),
                  getVertical(row, col, PLAYER),
                  getRightDiagonal(row, col, PLAYER),
                  getLeftDiagonal(row, col, PLAYER)
                ) - 1
              );

            // Tính khoảng cách từ nước đi này đến tất cả các ô X trên bảng
            const distancesToX = xPositions.map(
              (xPos) => Math.abs(xPos.row - row) + Math.abs(xPos.col - col)
            );

            // Chọn ô trống có điểm số tốt nhất và khoảng cách nhỏ nhất đến ô X
            bestMoves.push({
              row,
              col,
              score,
              minDistanceToX: Math.min(...distancesToX),
            });
          }
        }
      }

      // Sắp xếp danh sách theo điểm số giảm dần và khoảng cách tăng dần
      bestMoves.sort((a, b) => {
        if (a.score === b.score) {
          return a.minDistanceToX - b.minDistanceToX;
        }
        return b.score - a.score;
      });

      // Lặp qua danh sách các ô có điểm số tốt nhất và khoảng cách nhỏ nhất đến X
      for (const move of bestMoves) {
        const { row, col } = move;

        if (currentBoard[row][col] === null) {
          // Kiểm tra nếu ô cần đánh của máy tính là ô trống
          currentBoard[row][col] = AI_PLAYER;
          setBoard([...currentBoard]);
          dispatch(
            roomSlice.updateRoom({
              ...room,
              currentUserId: userLogin?.id,
              dataChess: currentBoard,
            })
          );
          setLastMoveByAI({ row, col });
          return;
        }
      }
    }
  };

  function getHorizontal(x, y, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      if (y + i < board[0].length && board[x][y + i] === player) {
        count++;
      } else {
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      if (y - i >= 0 && y - i < board[0].length && board[x][y - i] === player) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  function getVertical(x, y, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      if (x + i < board.length && board[x + i][y] === player) {
        count++;
      } else {
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      if (x - i >= 0 && x - i < board.length && board[x - i][y] === player) {
        count++;
      } else {
        break;
      }
    }

    return count;
  }

  function getRightDiagonal(x, y, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      if (
        x - i >= 0 &&
        x - i < board.length &&
        y + i < board[0].length &&
        board[x - i][y + i] === player
      ) {
        count++;
      } else {
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      if (
        x + i < board.length &&
        y - i >= 0 &&
        y - i < board[0].length &&
        board[x + i][y - i] === player
      ) {
        count++;
      } else {
        break;
      }
    }

    return count;
  }

  function getLeftDiagonal(x, y, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      if (
        x - i >= 0 &&
        x - i < board.length &&
        y - i >= 0 &&
        y - i < board[0].length &&
        board[x - i][y - i] === player
      ) {
        count++;
      } else {
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      if (
        x + i < board.length &&
        y + i < board[0].length &&
        board[x + i][y + i] === player
      ) {
        count++;
      } else {
        break;
      }
    }

    return count;
  }

  const renderSquare = (row, col) => (
    <button
      className={`square ${board[row][col] === PLAYER ? "black" : "red"} ${
        lastMove?.row === row && lastMove?.col === col ? "last-move" : ""
      } ${
        lastMoveByAI?.row === row && lastMoveByAI?.col === col
          ? "last-move-ai"
          : ""
      }`}
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

  const handlePlayAgain = () => {
    dispatch(
      roomSlice.updateRoom({
        ...roomFind,
        dataChess: BOARD_DEFAULT,
        currentUserId: room?.userId,
      })
    );
    setLastMove(null);
    setLastMoveByAI(null);
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
