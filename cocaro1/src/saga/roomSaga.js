import { call, put } from "redux-saga/effects";
import {
  ROOM_DELETE_SERVICE,
  ROOM_GET_SERVICE,
  ROOM_POST_SERVICE,
} from "../api/roomService";
import { getAllRoom } from "../redux/reducer/roomSlice";

export const ROOM_SAGA_GET = function* () {
  try {
    let rooms = yield call(ROOM_GET_SERVICE);
    yield put(getAllRoom(rooms));
  } catch (error) {
    console.log(error);
  }
};

export const ROOM_SAGA_POST = function* (action) {
  try {
    yield call(ROOM_POST_SERVICE, action.payload);
  } catch (error) {
    console.log(error);
  }
};

export const ROOM_SAGA_DELETE = function* (action) {
  try {
    yield call(ROOM_DELETE_SERVICE, action.payload);
  } catch (error) {
    console.log(error);
  }
};