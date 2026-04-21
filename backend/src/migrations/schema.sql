-- USERS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SCORES
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 1 AND score <= 45),
  played_at DATE,
  UNIQUE(user_id, played_at)
);

CREATE INDEX IF NOT EXISTS idx_scores_user_id ON scores(user_id);

-- SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled')),
  plan TEXT CHECK (plan IN ('monthly', 'yearly')),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  renewal_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prevent multiple active subscriptions
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_sub
ON subscriptions(user_id)
WHERE status = 'active';

-- CHARITIES
CREATE TABLE IF NOT EXISTS charities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (name)
);

-- USER CHARITY
CREATE TABLE IF NOT EXISTS user_charity (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  charity_id INTEGER REFERENCES charities(id) ON DELETE CASCADE,
  percentage INTEGER DEFAULT 10 CHECK (percentage >= 10),
  PRIMARY KEY (user_id)
);

-- PRIZE POOL
CREATE TABLE IF NOT EXISTS prize_pool (
  id SERIAL PRIMARY KEY,
  draw_month TEXT UNIQUE,
  total_amount NUMERIC(12,2) DEFAULT 0,
  charity_amount NUMERIC(12,2) DEFAULT 0,
  distributable_amount NUMERIC(12,2) DEFAULT 0,
  jackpot_carry_forward NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DRAWS
CREATE TABLE IF NOT EXISTS draws (
  id SERIAL PRIMARY KEY,
  draw_month TEXT,
  numbers INTEGER[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_draw_month ON draws(draw_month);

-- WINNERS
CREATE TABLE IF NOT EXISTS winners (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  draw_id INTEGER REFERENCES draws(id) ON DELETE CASCADE,
  match_count INTEGER,
  prize_amount NUMERIC(12,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'rejected')),
  proof_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_winners_user_id ON winners(user_id);