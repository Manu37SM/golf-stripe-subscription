import API from "./api";

export const createSubscriptionSession = async (plan) => {
  const res = await API.post("/subscription/create-session", { plan });
  return res.data;
};

export const getSubscriptionStatus = async () => {
  const res = await API.get("/subscription/status");
  return res.data;
};
