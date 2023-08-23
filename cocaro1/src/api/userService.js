import { intances } from "./axios";
export const USER_GET_SERVICE = async () => {
  let response = await intances.get("users");
  return response.data;
};

export const USER_POST_SERVICE = async (data) => {
  await intances.post("users", data);
};
