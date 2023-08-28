import React, { useEffect, useState } from "react";
import "../../assets/home.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createRoom, findAllRoom } from "../../redux/reducer/roomSlice";
import SearchRoom from "../../components/SearchRoom";
import store from "../../redux/store";

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

  useEffect(() => {
    dispatch(findAllRoom());
  }, []);
  const createdRoom = useSelector((state) => state.room.room); // Thay thế bằng selector thực tế của bạn

  const handleCreateRoom = async () => {
    let room = {
      roomName: roomName,
      roomPass: roomPass,
      userId: userLogin.id,
      playerId: null,
      currentUserId: null,
      status: 1,
      dataChess: null,
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

  return (
    <div className="w-100 d-flex justify-content-center btn-home align-items-center bg-dark ">
      <div className="w-25">
        <div>
          <button className="btn btn-warning btn-rounded mb-3 w-100">
            Choi voi may
          </button>
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
