import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteRoom, findAllRoom } from "../redux/reducer/roomSlice";
import { useNavigate } from "react-router-dom";
import "../../src/assets/board.css";
import ChessBoard from "./ChessBoard";
import ChatBox from "./ChatBox";
import { findAllMember } from "../redux/reducer/memberSlice";
import { Role } from "../enums/Role";
import { findAllUser } from "../redux/reducer/userSlice";

export default function Room() {
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.room.listRoom);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(findAllRoom());
  }, []);

  const roomFind = rooms.find((room) => room.userId === userLogin.id);

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
          <p className="text-light text-center fs-6">
            Ban({userLogin.username})
          </p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp=CAU"
            className="avatar"
            alt=""
          />
        </div>
        <div className="mb-2 me-5">
          <p className="text-light text-center fs-6">Doi Thu</p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp=CAU"
            className="avatar"
            alt=""
          />
        </div>
      </div>
      <ChessBoard />
      <ChatBox />
    </div>
  );
}
