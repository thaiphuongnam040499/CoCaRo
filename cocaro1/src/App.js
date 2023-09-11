import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/home/Home";
import Room from "./components/Room";
import "../src/i18n/i18n.js";
import RoomMachine from "./components/RoomMachine";
export default function App() {
  return (
    <div className="rooms">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
          <Route path="/roomMachine/:id" element={<RoomMachine />} />
        </Route>
      </Routes>
    </div>
  );
}
