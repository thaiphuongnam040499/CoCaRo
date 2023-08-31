import { useEffect, useState } from "react";

function useCutomeHook() {
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  return {
    userLogin,
  };
}

export default useCutomeHook;
