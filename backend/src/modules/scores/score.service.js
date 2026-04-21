const pool = require("../../../config/db");

const addScore = async (userId, { score, played_at }) => {
  // Check duplicate date
  const existing = await pool.query(
    "SELECT * FROM scores WHERE user_id = $1 AND played_at = $2",
    [userId, played_at],
  );

  if (existing.rows.length > 0) {
    throw new Error("Score for this date already exists");
  }

  // Count existing scores
  const countResult = await pool.query(
    "SELECT COUNT(*) FROM scores WHERE user_id = $1",
    [userId],
  );

  const count = parseInt(countResult.rows[0].count);

  // If already 5 → delete oldest
  if (count >= 5) {
    await pool.query(
      `DELETE FROM scores 
       WHERE id = (
         SELECT id FROM scores 
         WHERE user_id = $1 
         ORDER BY played_at ASC 
         LIMIT 1
       )`,
      [userId],
    );
  }

  // Insert new score
  const result = await pool.query(
    `INSERT INTO scores (user_id, score, played_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, score, played_at],
  );

  return result.rows[0];
};

const getScores = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM scores 
     WHERE user_id = $1 
     ORDER BY played_at DESC`,
    [userId],
  );

  return result.rows;
};

const updateScore = async (userId, scoreId, newScore) => {
  const result = await pool.query(
    `UPDATE scores 
     SET score = $1 
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
    [newScore, scoreId, userId],
  );

  if (result.rows.length === 0) {
    throw new Error("Score not found");
  }

  return result.rows[0];
};

const deleteScore = async (userId, scoreId) => {
  const result = await pool.query(
    `DELETE FROM scores 
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [scoreId, userId],
  );

  if (result.rows.length === 0) {
    throw new Error("Score not found");
  }

  return result.rows[0];
};

module.exports = {
  addScore,
  getScores,
  updateScore,
  deleteScore,
};
