import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listRoom: [],
  room: null,
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
    findCreateRoom: (state, action) => {
      state.room = action.payload;
    },
    updateRoom: (state, action) => {},
  },
});
export default roomSlice.reducer;
export const {
  findAllRoom,
  getAllRoom,
  createRoom,
  deleteRoom,
  findCreateRoom,
  updateRoom,
  findUpdateRoom,
} = roomSlice.actions;
