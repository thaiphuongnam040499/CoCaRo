import { intances } from "./axios";

export const MEMBER_GET_SERVICE = async () => {
  let response = await intances.get("members");
  return response.data;
};

export const MEMBER_POST_SERVICE = async (data) => {
  await intances.post("members", data);
};
