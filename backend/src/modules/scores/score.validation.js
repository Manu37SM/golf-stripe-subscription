const validateScore = (req, res, next) => {
  const { score, played_at } = req.body;

  if (!score || !played_at) {
    return res.status(400).json({
      error: "Score and date are required",
    });
  }

  if (score < 1 || score > 45) {
    return res.status(400).json({
      error: "Score must be between 1 and 45",
    });
  }

  next();
};

module.exports = validateScore;
