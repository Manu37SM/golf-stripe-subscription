import API from "./api";

export const getUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await API.put(`/admin/users/${id}/role`, { role });
  return res.data;
};

export const getCharities = async () => {
  const res = await API.get("/charity");
  return res.data;
};

export const createCharity = async (data) => {
  const res = await API.post("/admin/charity", data);
  return res.data;
};

export const updateCharity = async (id, data) => {
  const res = await API.put(`/admin/charity/${id}`, data);
  return res.data;
};

export const deleteCharity = async (id) => {
  const res = await API.delete(`/admin/charity/${id}`);
  return res.data;
};

export const getWinners = async () => {
  const res = await API.get("/admin/winners");
  return res.data;
};

export const updateWinner = async (id, status) => {
  const res = await API.put(`/admin/winners/${id}`, { status });
  return res.data;
};

export const getReports = async () => {
  const res = await API.get("/admin/reports");
  return res.data;
};

export const getDraws = async () => {
  const res = await API.get("/draw");
  return res.data;
};

export const createDraw = async (month) => {
  const res = await API.post("/draw", { month });
  return res.data;
};

export const runDraw = async (id) => {
  const res = await API.post(`/draw/${id}/run`);
  return res.data;
};

export const simulateDraw = async (id) => {
  const res = await API.post(`/draw/${id}/simulate`);
  return res.data;
};

export const publishDraw = async (id) => {
  const res = await API.post(`/draw/${id}/publish`);
  return res.data;
};
