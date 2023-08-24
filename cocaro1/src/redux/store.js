import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "../saga/rootSaga";
import userSlice from "./reducer/userSlice";
import roomSlice from "./reducer/roomSlice";
import memberSlice from "./reducer/memberSlice";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: {
    user: userSlice,
    room: roomSlice,
    member: memberSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: false,
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

sagaMiddleware.run(rootSaga);
export default store;
