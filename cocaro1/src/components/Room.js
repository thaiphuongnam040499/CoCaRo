import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteRoom, findAllRoom } from "../redux/reducer/roomSlice";
import { useNavigate } from "react-router-dom";
import "../../src/assets/board.css";
import ChessBoard from "./ChessBoard";

export default function Room() {
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.room.listRoom);
  const navigate = useNavigate();

  const roomFind = rooms.find((room) => room.userId === userLogin.id);
  useEffect(() => {
    dispatch(findAllRoom());
  }, []);

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
      <ChessBoard />
      <div className="chat-box bg-light ms-3 p-3">
        <p className="fs-6">Chat</p>
        <div className="border rounded p-2 chat-box-item">
          <div>
            <p className="fs-6">abcde</p>
          </div>
        </div>
        <div className="d-flex send-mess mt-2">
          <input type="text" className="border rounded me-2 w-100" />
          <div className="align-items-center">
            <button className="btn btn-success">send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
