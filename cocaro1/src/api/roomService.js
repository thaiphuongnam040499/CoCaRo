import { intances } from "./axios";

export const ROOM_GET_SERVICE = async () => {
  let response = await intances.get("rooms");
  return response.data;
};

export const ROOM_POST_SERVICE = async (data) => {
  await intances.post("rooms", data);
};

export const ROOM_DELETE_SERVICE = async (id) => {
  await intances.delete("rooms/" + id);
};
