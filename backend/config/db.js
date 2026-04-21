// const { Pool } = require("pg");
// const config = require("./env");

// const pool = new Pool({
//   host: config.db.host,
//   port: config.db.port,
//   user: config.db.user,
//   password: config.db.password,
//   database: config.db.database,
// });

// pool
//   .connect()
//   .then(() => console.log("✅ PostgreSQL connected"))
//   .catch((err) => {
//     console.error("❌ DB connection error:", err);
//     process.exit(1);
//   });

// module.exports = pool;

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
