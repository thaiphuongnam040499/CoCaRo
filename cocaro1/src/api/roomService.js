import { intances } from "./axios";

export const ROOM_GET_SERVICE = async () => {
  let response = await intances.get("rooms");
  return response.data;
};

export const ROOM_POST_SERVICE = async (room) => {
  let response = await intances.post("rooms", room);
  return response.data;
};

export const ROOM_PATCH_SERVICE = async (data) => {
  await intances.patch("rooms/" + data.id, data);
};

export const ROOM_DELETE_SERVICE = async (id) => {
  await intances.delete("rooms/" + id);
};
