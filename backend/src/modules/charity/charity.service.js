const pool = require("../../../config/db");

// Get all charities
const getCharities = async () => {
  const result = await pool.query("SELECT * FROM charities");
  return result.rows;
};

// Select charity
const selectCharity = async (userId, charityId, percentage) => {
  if (percentage < 10) {
    throw new Error("Minimum 10% required");
  }

  // Remove existing selection
  await pool.query("DELETE FROM user_charity WHERE user_id = $1", [userId]);

  const result = await pool.query(
    `INSERT INTO user_charity (user_id, charity_id, percentage)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, charityId, percentage],
  );

  return result.rows[0];
};

// Get user charity
const getUserCharity = async (userId) => {
  const result = await pool.query(
    `SELECT uc.*, c.name, c.description 
     FROM user_charity uc
     JOIN charities c ON uc.charity_id = c.id
     WHERE uc.user_id = $1`,
    [userId],
  );

  return result.rows[0];
};

module.exports = {
  getCharities,
  selectCharity,
  getUserCharity,
};
