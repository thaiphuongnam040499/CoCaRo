import React, { useState } from "react";
import "../../assets/home.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createRoom } from "../../redux/reducer/roomSlice";
import SearchRoom from "../../components/SearchRoom";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [roomPass, setRoomPass] = useState("");
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userLogin");
    navigate("/");
  };

  const handleCreateRoom = () => {
    let room = {
      roomName: roomName,
      roomPass: roomPass,
      userId: userLogin.id,
    };
    dispatch(createRoom(room));
    navigate("/room");
  };

  return (
    <div className="w-100 d-flex justify-content-center btn-home align-items-center bg-dark ">
      <div className="w-25">
        <div>
          <div className="dropdown">
            <button
              className="btn btn-success btn-rounded mb-3 w-100 "
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Tao Phong
            </button>
            <ul
              className="dropdown-menu p-2 room"
              aria-labelledby="dropdownMenuButton1"
            >
              <li>
                <p className="p-0 text-center">Tao Phong</p>
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
                    type="password"
                    onChange={(e) => {
                      setRoomPass(e.target.value);
                    }}
                    className="border rounded input-room w-100"
                  />
                </div>
                <div>
                  <button
                    onClick={handleCreateRoom}
                    className="btn btn-success btn-rounded mb-3 w-100"
                  >
                    Tao Phong
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <SearchRoom />
        <div>
          <button
            onClick={handleLogout}
            className="btn btn-danger btn-rounded mb-3 w-100"
          >
            Thoat
          </button>
        </div>
      </div>
    </div>
  );
}
