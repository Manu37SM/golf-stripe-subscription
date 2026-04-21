const pool = require('../../../config/db');

// USERS
const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.created_at,
            s.status as subscription_status, s.plan
     FROM users u
     LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
     ORDER BY u.created_at DESC`
  );
  return result.rows;
};

const updateUserRole = async (userId, role) => {
  const result = await pool.query(
    `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role`,
    [role, userId]
  );
  return result.rows[0];
};

// CHARITIES
const createCharity = async ({ name, description, image_url, is_featured }) => {
  const result = await pool.query(
    `INSERT INTO charities (name, description, image_url, is_featured)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, description, image_url || '', is_featured || false]
  );
  return result.rows[0];
};

const updateCharity = async (id, data) => {
  const { name, description, image_url, is_featured } = data;
  const result = await pool.query(
    `UPDATE charities SET name=$1, description=$2, image_url=$3, is_featured=$4 WHERE id=$5 RETURNING *`,
    [name, description, image_url, is_featured, id]
  );
  return result.rows[0];
};

const deleteCharity = async (id) => {
  await pool.query('DELETE FROM charities WHERE id = $1', [id]);
};

// WINNERS
const getAllWinners = async () => {
  const result = await pool.query(
    `SELECT w.*, u.name as user_name, u.email, d.draw_month, d.numbers as draw_numbers
     FROM winners w
     JOIN users u ON w.user_id = u.id
     JOIN draws d ON w.draw_id = d.id
     ORDER BY w.created_at DESC`
  );
  return result.rows;
};

const updateWinnerStatus = async (winnerId, status) => {
  const result = await pool.query(
    `UPDATE winners SET status = $1 WHERE id = $2 RETURNING *`,
    [status, winnerId]
  );
  if (result.rows.length === 0) throw new Error('Winner not found');
  return result.rows[0];
};

// REPORTS
const getReports = async () => {
  const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
  const activeSubscriptions = await pool.query("SELECT COUNT(*) FROM subscriptions WHERE status='active'");
  const totalPrizePool = await pool.query('SELECT COALESCE(SUM(total_amount),0) as total FROM prize_pool');
  const charityContributions = await pool.query('SELECT COALESCE(SUM(charity_amount),0) as total FROM prize_pool');
  const totalDraws = await pool.query('SELECT COUNT(*) FROM draws');
  const totalWinners = await pool.query('SELECT COUNT(*) FROM winners');
  const paidWinners = await pool.query("SELECT COUNT(*) FROM winners WHERE status='paid'");

  return {
    totalUsers: parseInt(totalUsers.rows[0].count),
    activeSubscriptions: parseInt(activeSubscriptions.rows[0].count),
    totalPrizePool: parseFloat(totalPrizePool.rows[0].total),
    charityContributions: parseFloat(charityContributions.rows[0].total),
    totalDraws: parseInt(totalDraws.rows[0].count),
    totalWinners: parseInt(totalWinners.rows[0].count),
    paidWinners: parseInt(paidWinners.rows[0].count),
  };
};

// SEED — populate sample charities if none exist
const seedCharities = async () => {
  const existing = await pool.query('SELECT COUNT(*) FROM charities');
  if (parseInt(existing.rows[0].count) > 0) {
    return { message: 'Charities already exist, skipping seed.' };
  }

  const charities = [
    { name: 'Cancer Research UK', description: 'The world\'s leading cancer charity, funding life-saving research into all types of cancer.', is_featured: true },
    { name: "Alzheimer's Society", description: 'Leading the fight against dementia, supporting people affected and funding research to find a cure.', is_featured: false },
    { name: 'British Heart Foundation', description: 'Funding groundbreaking research into heart and circulatory diseases.', is_featured: false },
    { name: 'MacMillan Cancer Support', description: 'Medical, emotional, practical and financial support to people living with cancer.', is_featured: true },
    { name: 'Save the Children', description: 'Fighting for children\'s rights and delivering lasting change in over 100 countries.', is_featured: false },
    { name: 'Age UK', description: 'Ensuring older people are treated with respect and dignity, with their voices heard.', is_featured: false },
  ];

  for (const c of charities) {
    await pool.query(
      `INSERT INTO charities (name, description, image_url, is_featured) VALUES ($1, $2, '', $3)`,
      [c.name, c.description, c.is_featured]
    );
  }

  return { message: `Seeded ${charities.length} charities successfully.` };
};

module.exports = {
  getAllUsers, updateUserRole,
  createCharity, updateCharity, deleteCharity,
  getAllWinners, updateWinnerStatus,
  getReports,
  seedCharities,
};
