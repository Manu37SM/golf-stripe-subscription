const pool = require('../../../config/db');

// Get winners for logged-in user
const getMyWinners = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM winners WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};

// Upload proof
const uploadProof = async (userId, winnerId, filePath) => {
  const result = await pool.query(
    `UPDATE winners
     SET proof_url = $1, status = 'pending'
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
    [filePath, winnerId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Winner not found');
  }

  return result.rows[0];
};

module.exports = {
  getMyWinners,
  uploadProof,
};