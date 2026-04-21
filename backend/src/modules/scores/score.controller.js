const scoreService = require("./score.service");

const addScore = async (req, res) => {
  try {
    const userId = req.user.userId;
    const score = await scoreService.addScore(userId, req.body);

    res.status(201).json({
      message: "Score added successfully",
      score,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getScores = async (req, res) => {
  try {
    const userId = req.user.userId;
    const scores = await scoreService.getScores(userId);

    res.status(200).json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateScore = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const updated = await scoreService.updateScore(userId, id, req.body.score);

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteScore = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await scoreService.deleteScore(userId, id);

    res.status(200).json({ message: "Score deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  addScore,
  getScores,
  updateScore,
  deleteScore,
};
