const fs = require("fs");
const path = require("path");
const postgres = require("postgres");

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
});

const initDb = async () => {
  try {
    console.log("📦 Initializing database...");

    const schema = fs.readFileSync(
      path.join(process.cwd(), "src/migrations/schema.sql"),
      "utf-8",
    );

    const seed = fs.readFileSync(
      path.join(process.cwd(), "src/migrations/seed.sql"),
      "utf-8",
    );

    await sql.unsafe(schema);
    console.log("✅ Schema ready");

    await sql.unsafe(seed);
    console.log("🌱 Seed data inserted");
  } catch (err) {
    console.error("❌ DB Init failed:", err.message);
  }
};

module.exports = initDb;
