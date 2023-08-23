import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listUser: [],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    createUser: (state, action) => {},
    findAllUser: () => {},
    getAllUser: (state, action) => {
      state.listUser = action.payload;
    },
  },
});
export default userSlice.reducer;
export const { createUser, findAllUser, getAllUser } = userSlice.actions;
