import { call, put } from "redux-saga/effects";
import * as roomService from "../api/roomService";
import {
  findAllRoom,
  findCreateRoom,
  getAllRoom,
} from "../redux/reducer/roomSlice";

export const ROOM_SAGA_GET = function* () {
  try {
    let rooms = yield call(roomService.ROOM_GET_SERVICE);
    yield put(getAllRoom(rooms));
  } catch (error) {
    console.log(error);
  }
};

export const ROOM_SAGA_POST = function* (action) {
  try {
    let room = yield call(roomService.ROOM_POST_SERVICE, action.payload);
    yield put(findCreateRoom(room));
  } catch (error) {
    console.log(error);
  }
};

export const ROOM_SAGA_PATCH = function* (action) {
  try {
    yield call(roomService.ROOM_PATCH_SERVICE, action.payload);
  } catch (error) {
    console.log(error);
  }
};

export const ROOM_SAGA_DELETE = function* (action) {
  try {
    yield call(roomService.ROOM_DELETE_SERVICE, action.payload);
  } catch (error) {
    console.log(error);
  }
};
