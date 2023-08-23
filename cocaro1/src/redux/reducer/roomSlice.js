import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listRoom: [],
};

const roomSlice = createSlice({
  name: "room",
  initialState: initialState,
  reducers: {
    findAllRoom: () => {},
    getAllRoom: (state, action) => {
      state.listRoom = action.payload;
    },
    createRoom: (state, action) => {},
    deleteRoom: (state, action) => {},
  },
});
export default roomSlice.reducer;
export const { findAllRoom, getAllRoom, createRoom, deleteRoom } =
  roomSlice.actions;
