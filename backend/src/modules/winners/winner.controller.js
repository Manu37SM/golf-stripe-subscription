const winnerService = require("./winner.service");

const getMyWinners = async (req, res) => {
  try {
    const userId = req.user.userId;

    const data = await winnerService.getMyWinners(userId);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadProof = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const result = await winnerService.uploadProof(userId, id, req.file.path);

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getMyWinners,
  uploadProof,
};
