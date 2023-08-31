import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AuthLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
