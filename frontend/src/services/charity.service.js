import API from "./api";

export const getCharities = async () => {
  const res = await API.get("/charity");
  return res.data;
};

export const selectCharity = async (data) => {
  const res = await API.post("/charity/select", data);
  return res.data;
};

export const getMyCharity = async () => {
  const res = await API.get("/charity/me");
  return res.data;
};
