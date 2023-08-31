import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="bg-dark">
      <Navbar />
      <Outlet />
    </div>
  );
}
