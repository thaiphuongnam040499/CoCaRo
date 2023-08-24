import { call, put } from "redux-saga/effects";
import { MEMBER_GET_SERVICE, MEMBER_POST_SERVICE } from "../api/memberService";
import { getAllMember } from "../redux/reducer/memberSlice";

export const MEMBER_SAGA_GET = function* () {
  try {
    let members = yield call(MEMBER_GET_SERVICE);
    yield put(getAllMember(members));
  } catch (error) {
    console.log(error);
  }
};

export const MEMBER_SAGA_POST = function* (action) {
  try {
    yield call(MEMBER_POST_SERVICE, action.payload);
  } catch (error) {
    console.log(error);
  }
};
