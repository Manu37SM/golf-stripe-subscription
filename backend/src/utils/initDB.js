const fs = require("fs");
const path = require("path");
const pool = require("../../config/db");

const initDb = async () => {
  try {
    console.log("📦 Initializing database...");

    const schema = fs.readFileSync(
      path.join(__dirname, "../migrations/schema.sql"),
      "utf-8",
    );

    const seed = fs.readFileSync(
      path.join(__dirname, "../migrations/seed.sql"),
      "utf-8",
    );

    await pool.query(schema);
    console.log("✅ Schema ready");

    await pool.query(seed);
    console.log("🌱 Seed data inserted");
  } catch (err) {
    console.error("❌ DB Init failed:", err.message);
  }
};

module.exports = initDb;
