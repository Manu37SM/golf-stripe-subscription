import API from "./api";

export const getDashboardData = async () => {
  // Each request is caught individually so a 403 on /scores (no subscription)
  // does NOT crash the entire dashboard Promise.all
  const [scoresRes, charityRes, winnersRes] = await Promise.all([
    API.get("/scores").catch((err) => {
      // 403 = no active subscription — return empty scores, not a crash
      if (err.response?.status === 403) return { data: [] };
      throw err;
    }),
    API.get("/charity/me").catch(() => ({ data: null })),
    API.get("/winners/my").catch(() => ({ data: [] })),
  ]);

  return {
    scores: scoresRes.data,
    charity: charityRes.data,
    winnings: winnersRes.data,
  };
};
