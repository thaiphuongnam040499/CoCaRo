import { all, takeLatest } from "redux-saga/effects";
import { createUser, findAllUser } from "../redux/reducer/userSlice";
import { USER_SAGA_GET, USER_SAGA_POST } from "./userSaga";
import {
  createRoom,
  deleteRoom,
  findAllRoom,
} from "../redux/reducer/roomSlice";
import { ROOM_SAGA_DELETE, ROOM_SAGA_GET, ROOM_SAGA_POST } from "./roomSaga";
import { createMember, findAllMember } from "../redux/reducer/memberSlice";
import { MEMBER_SAGA_GET, MEMBER_SAGA_POST } from "./memberSaga";

export const rootSaga = function* () {
  yield all([
    // user
    takeLatest(findAllUser.type, USER_SAGA_GET),
    takeLatest(createUser.type, USER_SAGA_POST),
    // room
    takeLatest(findAllRoom.type, ROOM_SAGA_GET),
    takeLatest(createRoom.type, ROOM_SAGA_POST),
    takeLatest(deleteRoom.type, ROOM_SAGA_DELETE),
    // member
    takeLatest(findAllMember.type, MEMBER_SAGA_GET),
    takeLatest(createMember.type, MEMBER_SAGA_POST),
  ]);
};
