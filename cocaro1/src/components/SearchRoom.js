import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findAllRoom } from "../redux/reducer/roomSlice";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function SearchRoom() {
  const [roomName, setRoomName] = useState("");
  const [roomPass, setRoomPass] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rooms = useSelector((state) => state.room.listRoom);
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  const roomSearch = rooms.find(
    (room) => room.roomName === roomName && roomPass === room.roomPass
  );

  const handleJoinRoom = () => {
    if (roomSearch) {
      navigate(`/room/${roomSearch.id}`);
    } else {
      toast.error("Phong khong ton tai");
    }
  };

  useEffect(() => {
    dispatch(findAllRoom());
  }, []);
  return (
    <div>
      <Toaster />
      <div className="dropdown">
        <button
          className="btn btn-info btn-rounded mb-3 w-100 "
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Choi voi ban
        </button>
        <ul
          className="dropdown-menu p-2 room"
          aria-labelledby="dropdownMenuButton1"
        >
          <li>
            <p className="p-0 text-center">Tim Phong</p>
            <div className="mb-2">
              <p>Ten phong</p>
              <input
                type="text"
                onChange={(e) => {
                  setRoomName(e.target.value);
                }}
                className="border rounded input-room w-100"
              />
            </div>
            <div className="mb-2">
              <p>Password</p>
              <input
                onChange={(e) => {
                  setRoomPass(e.target.value);
                }}
                type="password"
                className="border rounded input-room w-100"
              />
            </div>
            <div>
              <button
                onClick={handleJoinRoom}
                className="btn btn-info btn-rounded mb-3 w-100"
              >
                Vao Phong
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
