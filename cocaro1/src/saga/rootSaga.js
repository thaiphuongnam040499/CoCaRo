import { all, takeLatest } from "redux-saga/effects";
import * as userSlice from "../redux/reducer/userSlice";
import * as userSaga from "./userSaga";
import * as roomSlice from "../redux/reducer/roomSlice";
import * as roomSaga from "./roomSaga";

export const rootSaga = function* () {
  yield all([
    // user
    takeLatest(userSlice.findAllUser.type, userSaga.USER_SAGA_GET),
    takeLatest(userSlice.createUser.type, userSaga.USER_SAGA_POST),
    // room
    takeLatest(roomSlice.findAllRoom.type, roomSaga.ROOM_SAGA_GET),
    takeLatest(roomSlice.createRoom.type, roomSaga.ROOM_SAGA_POST),
    takeLatest(roomSlice.updateRoom.type, roomSaga.ROOM_SAGA_PATCH),
    takeLatest(roomSlice.deleteRoom.type, roomSaga.ROOM_SAGA_DELETE),
  ]);
};
