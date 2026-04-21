const pool = require("../../config/db");

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query("SELECT role FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "User not found" });
    }

    if (result.rows[0].role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = isAdmin;
