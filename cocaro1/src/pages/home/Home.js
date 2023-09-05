import React, { useEffect, useState } from "react";
import "../../assets/home.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createRoom, findAllRoom } from "../../redux/reducer/roomSlice";
import SearchRoom from "../../components/SearchRoom";
import store from "../../redux/store";
import { useTranslation } from "react-i18next";
const ROWS = 16;
const COLS = 16;
const BOARD_DEFAULT = Array(ROWS).fill(Array(COLS).fill(null));

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [roomPass, setRoomPass] = useState("");
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("userLogin");
    navigate("/");
  };

  useEffect(() => {
    dispatch(findAllRoom());
  }, []);

  const handleCreateRoom = async () => {
    let room = {
      roomName: roomName,
      roomPass: roomPass,
      userId: userLogin.id,
      playerId: null,
      currentUserId: null,
      status: 1,
      dataChess: BOARD_DEFAULT,
    };
    await dispatch(createRoom(room)); // Đợi cho createRoom hoàn thành

    // Lắng nghe sự kiện thay đổi trong store
    const unsubscribe = store.subscribe(() => {
      const state = store.getState(); // Lấy state hiện tại từ store
      const createdRoom = state.room.room;
      if (createdRoom) {
        navigate(`/room/${createdRoom.id}`);
        setRoomName("");
        setRoomPass("");
        // Hủy đăng ký lắng nghe
        unsubscribe();
      }
    });
  };

  const handleCreateRoomMachine = async () => {
    let room = {
      roomName: roomName,
      roomPass: roomPass,
      userId: userLogin.id,
      playerId: null,
      currentUserId: userLogin.id,
      status: 1,
      dataChess: BOARD_DEFAULT,
      onerTime: 15,
      playerTime: 15,
      onerLost: false,
      playerLost: false,
    };
    await dispatch(createRoom(room)); // Đợi cho createRoom hoàn thành

    // Lắng nghe sự kiện thay đổi trong store
    const unsubscribe = store.subscribe(() => {
      const state = store.getState(); // Lấy state hiện tại từ store
      const createdRoom = state.room.room;
      if (createdRoom) {
        navigate(`/room-machine/${createdRoom.id}`);
        setRoomName("");
        setRoomPass("");
        // Hủy đăng ký lắng nghe
        unsubscribe();
      }
    });
  };

  return (
    <div>
      <div className="w-100 d-flex justify-content-center btn-home align-items-center bg-dark ">
        <div className="w-25">
          <div>
            <div className="dropdown">
              <button
                className="btn btn-warning btn-rounded mb-3 w-100 "
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {t("playMachine")}
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
                      onClick={handleCreateRoomMachine}
                      className="btn btn-success btn-rounded mb-3 w-100"
                    >
                      Tao Phong
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="dropdown">
              <button
                className="btn btn-success btn-rounded mb-3 w-100 "
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {t("createRoom")}
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
              {t("exits")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
