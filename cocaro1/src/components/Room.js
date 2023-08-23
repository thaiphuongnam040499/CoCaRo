import React, { useEffect, useState } from "react";
import Board from "./Board";
import { useDispatch, useSelector } from "react-redux";
import { deleteRoom, findAllRoom } from "../redux/reducer/roomSlice";
import { useNavigate } from "react-router-dom";

export default function Room() {
  const [squares, setSquares] = useState(Array(64).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.room.listRoom);
  const navigate = useNavigate();

  const roomFind = rooms.find((room) => room.userId === userLogin.id);
  useEffect(() => {
    dispatch(findAllRoom());
  }, []);

  const handleClick = (i) => {
    if (checkWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setSquares(squares);
    setXIsNext(!xIsNext);
  };

  const winner = checkWinner(squares);

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const handleOutRoom = () => {
    if (roomFind && userLogin) {
      dispatch(deleteRoom(roomFind.id));
      navigate("/home");
    } else {
      navigate("/home");
    }
  };
  return (
    <div className="bg-dark room-game">
      <div className="pt-2 ps-2">
        <button onClick={handleOutRoom} className="btn btn-danger">
          Roi phong
        </button>
      </div>
      <div className="d-flex justify-content-around mb-2 pt-5">
        <div className="mb-2 me-5">
          <p className="text-light text-center fs-6">Ban</p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp=CAU"
            className="avatar"
            alt=""
          />
        </div>
        <div className="mb-2 me-5">
          <p className="text-light text-center fs-6">Doi thu</p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp=CAU"
            className="avatar"
            alt=""
          />
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="game">
          <div className="game-board">
            <div className="game-info mb-3">
              <div className="text-light">{status}</div>
            </div>
            <Board squares={squares} onClick={(i) => handleClick(i)} />
          </div>
        </div>
      </div>
      <div className="chat-box bg-light ms-3 p-3">
        <p className="fs-6">Chat</p>
        <div className="border rounded p-2 chat-box-item">
          <div>
            <p className="fs-6">abcde</p>
          </div>
          <div className="d-flex send-mess">
            <input type="text" className="border rounded me-2 w-100" />
            <div className="align-items-center">
              <button className="btn btn-success">send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function checkWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
