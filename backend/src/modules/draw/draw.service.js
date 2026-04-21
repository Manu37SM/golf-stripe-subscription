const pool = require("../../../config/db");
const { generateRandomNumbers } = require("./draw.utils");

// Create draw (admin only)
const createDraw = async (month) => {
  const numbers = generateRandomNumbers();

  const result = await pool.query(
    `INSERT INTO draws (draw_month, numbers)
     VALUES ($1, $2)
     RETURNING *`,
    [month, numbers],
  );

  return result.rows[0];
};

// Run draw logic
const runDraw = async (drawId) => {
  const drawRes = await pool.query("SELECT * FROM draws WHERE id = $1", [drawId]);

  if (drawRes.rows.length === 0) throw new Error("Draw not found");

  const draw = drawRes.rows[0];
  const drawNumbers = draw.numbers;
  const month = draw.draw_month;

  // Get prize pool
  const poolRes = await pool.query(
    "SELECT * FROM prize_pool WHERE draw_month = $1",
    [month],
  );

  if (poolRes.rows.length === 0) {
    throw new Error("No prize pool found for this month");
  }

  const poolData = poolRes.rows[0];

  let distributable = parseFloat(poolData.distributable_amount);
  let jackpotCarry = parseFloat(poolData.jackpot_carry_forward || 0);

  distributable += jackpotCarry;

  // Split tiers
  const tier5Pool = distributable * 0.4;
  const tier4Pool = distributable * 0.35;
  const tier3Pool = distributable * 0.25;

  // Get all users with active subscriptions who have scores
  const users = await pool.query(
    `SELECT DISTINCT s.user_id FROM scores s
     JOIN subscriptions sub ON s.user_id = sub.user_id
     WHERE sub.status = 'active'`
  );

  let winners5 = [];
  let winners4 = [];
  let winners3 = [];

  for (let user of users.rows) {
    const scoreRes = await pool.query(
      `SELECT score FROM scores WHERE user_id = $1`,
      [user.user_id],
    );

    const userScores = scoreRes.rows.map((s) => s.score);
    const matches = userScores.filter((s) => drawNumbers.includes(s)).length;

    if (matches >= 5) winners5.push(user.user_id);
    else if (matches === 4) winners4.push(user.user_id);
    else if (matches === 3) winners3.push(user.user_id);
  }

  const prize5 = winners5.length ? tier5Pool / winners5.length : 0;
  const prize4 = winners4.length ? tier4Pool / winners4.length : 0;
  const prize3 = winners3.length ? tier3Pool / winners3.length : 0;

  const insertWinner = async (userId, match, prize) => {
    await pool.query(
      `INSERT INTO winners (user_id, draw_id, match_count, prize_amount, status)
       VALUES ($1, $2, $3, $4, 'pending')`,
      [userId, drawId, match, prize],
    );
  };

  for (let u of winners5) await insertWinner(u, 5, prize5);
  for (let u of winners4) await insertWinner(u, 4, prize4);
  for (let u of winners3) await insertWinner(u, 3, prize3);

  // BUG FIX: was using $2 in WHERE clause for jackpot_carry_forward update — should be $1
  if (winners5.length === 0) {
    await pool.query(
      `UPDATE prize_pool SET jackpot_carry_forward = $1 WHERE draw_month = $2`,
      [tier5Pool, month],
    );
  } else {
    await pool.query(
      `UPDATE prize_pool SET jackpot_carry_forward = 0 WHERE draw_month = $1`,
      [month],
    );
  }

  return { winners5, winners4, winners3, prize5, prize4, prize3 };
};

// Simulate draw (preview without saving winners)
const simulateDraw = async (drawId) => {
  const drawRes = await pool.query("SELECT * FROM draws WHERE id = $1", [drawId]);
  if (drawRes.rows.length === 0) throw new Error("Draw not found");

  const draw = drawRes.rows[0];
  const drawNumbers = draw.numbers;

  const users = await pool.query(
    `SELECT DISTINCT s.user_id, u.name FROM scores s JOIN users u ON s.user_id = u.id`
  );

  let preview5 = [], preview4 = [], preview3 = [];

  for (let user of users.rows) {
    const scoreRes = await pool.query(
      `SELECT score FROM scores WHERE user_id = $1`,
      [user.user_id],
    );
    const userScores = scoreRes.rows.map((s) => s.score);
    const matches = userScores.filter((s) => drawNumbers.includes(s)).length;

    if (matches >= 5) preview5.push(user.name);
    else if (matches === 4) preview4.push(user.name);
    else if (matches === 3) preview3.push(user.name);
  }

  return { drawNumbers, preview5, preview4, preview3 };
};

// Publish draw
const publishDraw = async (drawId) => {
  const result = await pool.query(
    `UPDATE draws SET status = 'published' WHERE id = $1 RETURNING *`,
    [drawId],
  );
  if (result.rows.length === 0) throw new Error("Draw not found");
  return result.rows[0];
};

// Get all draws
const getAllDraws = async () => {
  const result = await pool.query(
    `SELECT * FROM draws ORDER BY created_at DESC`
  );
  return result.rows;
};

module.exports = { createDraw, runDraw, simulateDraw, publishDraw, getAllDraws };
