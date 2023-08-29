import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRoom,
  findAllRoom,
  updateRoom,
} from "../redux/reducer/roomSlice";
import { useNavigate, useParams } from "react-router-dom";
import "../../src/assets/board.css";
import ChessBoard from "./ChessBoard";
import ChatBox from "./ChatBox";
import { findAllUser } from "../redux/reducer/userSlice";
import { Toaster, toast } from "react-hot-toast";
const ROWS = 16;
const COLS = 16;

const BOARD_DEFAULT = Array(ROWS).fill(Array(COLS).fill(null));

export default function Room() {
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const users = useSelector((state) => state.user.listUser);
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.room.listRoom);
  const navigate = useNavigate();
  const { id } = useParams();
  const [isShowChat, setIsShowChat] = useState(false);

  useEffect(() => {
    dispatch(findAllRoom());
    dispatch(findAllUser());
  }, []);

  const handleShowChat = () => {
    setIsShowChat(true);
  };

  const handleOffShowChat = () => {
    setIsShowChat(false);
  };

  const roomFind = rooms.find((room) => room.id === parseInt(id));

  const roomByPlayer = rooms.find(
    (room) => room.playerId === roomFind?.playerId
  );

  const player = users.find((user) => user.id === roomByPlayer?.playerId);

  const handleOutRoom = () => {
    if (roomFind && userLogin) {
      dispatch(deleteRoom(roomFind.id));
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
  };

  const handleClick = () => {
    toast((t) => (
      <span>
        Ban co muon choi lai
        <button className="btn btn-danger ms-2" onClick={handlePlayAgain}>
          {" "}
          Choi lai
        </button>
      </span>
    ));
  };

  const renderPlayer =
    roomFind?.playerId != null ? (
      <div className="mb-2 me-5">
        <Toaster position="top-center" reverseOrder={false} />
        <p className="text-light text-center fs-6">
          Doi Thu({player?.username})
        </p>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp=CAU"
          className="avatar"
          alt=""
        />
        <p className="text-light text-center fs-6 mt-2">
          {roomFind?.status ? "Chuan bi..." : "San sang"}
        </p>
      </div>
    ) : (
      <div className="d-flex align-items-center">
        <p className="text-light ">Cho doi thu vao phong...</p>
      </div>
    );

  return (
    <div className="bg-dark room-game">
      <div className="d-flex justify-content-around mb-2 pt-5">
        <div className="mb-2 me-5">
          <p className="text-light text-center fs-6">
            Ban({userLogin.username})
          </p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp=CAU"
            className="avatar"
            alt=""
          />
          <p className="text-light text-center fs-6 mt-2">
            {roomFind?.status ? "Chuan bi..." : "San sang"}
          </p>
        </div>
        <div className="d-flex align-items-center">
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
              onClick={handleClick}
              className="btn btn-info btn-rounded mb-3 w-100"
            >
              Choi lai
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
        {renderPlayer}
      </div>
      <ChessBoard />
      <div>
        <button
          onClick={handleShowChat}
          className="btn btn-light ms-3 btn-chat-box"
        >
          <i className="bi bi-chat me-2"></i>Chat box
        </button>
      </div>
      {isShowChat ? <ChatBox handleOffShowChat={handleOffShowChat} /> : ""}
    </div>
  );
}
