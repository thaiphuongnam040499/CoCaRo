import { call, put } from "redux-saga/effects";
import { USER_GET_SERVICE, USER_POST_SERVICE } from "../api/userService";
import { getAllUser } from "../redux/reducer/userSlice";

export const USER_SAGA_GET = function* () {
  try {
    let users = yield call(USER_GET_SERVICE);
    yield put(getAllUser(users));
  } catch (error) {
    console.log(error);
  }
};

export const USER_SAGA_POST = function* (action) {
  try {
    yield call(USER_POST_SERVICE, action.payload);
  } catch (error) {
    console.log(error);
  }
};
