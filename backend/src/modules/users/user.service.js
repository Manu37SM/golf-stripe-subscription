const pool = require("../../../config/db");

const getProfile = async (userId) => {
  const result = await pool.query(
    "SELECT id, name, email FROM users WHERE id = $1",
    [userId],
  );

  return result.rows[0];
};

module.exports = {
  getProfile,
};
