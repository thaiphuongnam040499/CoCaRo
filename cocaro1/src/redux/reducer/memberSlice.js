import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listMember: [],
};

const memberSlice = createSlice({
  name: "member",
  initialState: initialState,
  reducers: {
    getAllMember: (state, action) => {
      state.listMember = action.payload;
    },
    findAllMember: () => {},
    createMember: (state, action) => {},
  },
});
export default memberSlice.reducer;
export const { getAllMember, findAllMember, createMember } =
  memberSlice.actions;
