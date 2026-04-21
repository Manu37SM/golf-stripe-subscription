import API from "./api";

export const addScore = async (data) => {
  const res = await API.post("/scores", data);
  return res.data;
};

export const getScores = async () => {
  const res = await API.get("/scores");
  return res.data;
};

export const updateScore = async (id, score) => {
  const res = await API.put(`/scores/${id}`, { score });
  return res.data;
};

export const deleteScore = async (id) => {
  const res = await API.delete(`/scores/${id}`);
  return res.data;
};
