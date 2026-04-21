const pool = require("../../../config/db");
const stripe = require("../../../config/stripe");

const createCheckoutSession = async (userId, plan) => {
  const customer = await stripe.customers.create({
    metadata: { userId: String(userId) },
  });

  const priceId =
    plan === "yearly"
      ? process.env.STRIPE_YEARLY_PRICE_ID
      : process.env.STRIPE_PRICE_ID;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer: customer.id,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId: String(userId), plan },
    subscription_data: { metadata: { userId: String(userId), plan } },
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/subscription`,
  });

  return session.url;
};

const activateSubscription = async (session) => {
  const userId = session.metadata?.userId;
  if (!userId) throw new Error("No userId in session metadata");

  const plan = session.metadata?.plan || "monthly";
  const month = new Date().toISOString().slice(0, 7);
  const amount = (session.amount_total || 0) / 100;

  const existing = await pool.query(
    `SELECT id FROM subscriptions WHERE user_id = $1`,
    [userId],
  );

  if (existing.rows.length > 0) {
    await pool.query(
      `UPDATE subscriptions
       SET stripe_customer_id=$1, stripe_subscription_id=$2, plan=$3, status='active', start_date=NOW()
       WHERE user_id=$4`,
      [session.customer, session.subscription, plan, userId],
    );
  } else {
    await pool.query(
      `INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, plan, status, start_date)
       VALUES ($1,$2,$3,$4,'active',NOW())`,
      [userId, session.customer, session.subscription, plan],
    );
  }

  if (amount > 0) await updatePrizePool(amount, month);
};

const cancelSubscription = async (userId) => {
  // Get the Stripe subscription ID from DB
  const result = await pool.query(
    `SELECT stripe_subscription_id FROM subscriptions WHERE user_id=$1 AND status='active'`,
    [userId],
  );

  if (result.rows.length === 0) throw new Error("No active subscription found");

  const stripeSubId = result.rows[0].stripe_subscription_id;

  // Cancel at period end in Stripe so user keeps access until billing cycle ends
  if (stripeSubId) {
    await stripe.subscriptions.update(stripeSubId, {
      cancel_at_period_end: true,
    });
  }

  // Mark as cancelled in DB immediately
  await pool.query(
    `UPDATE subscriptions SET status='cancelled' WHERE user_id=$1`,
    [userId],
  );
};

const deactivateSubscription = async (stripeSubscriptionId) => {
  await pool.query(
    `UPDATE subscriptions SET status='cancelled' WHERE stripe_subscription_id=$1`,
    [stripeSubscriptionId],
  );
};

const checkActiveSubscription = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM subscriptions WHERE user_id=$1 AND status='active'`,
    [userId],
  );
  return result.rows.length > 0;
};

const updatePrizePool = async (amount, month) => {
  const charityShare = amount * 0.1;
  const distributable = amount - charityShare;

  const existing = await pool.query(
    "SELECT * FROM prize_pool WHERE draw_month=$1",
    [month],
  );

  if (existing.rows.length > 0) {
    await pool.query(
      `UPDATE prize_pool SET total_amount=total_amount+$1, charity_amount=charity_amount+$2, distributable_amount=distributable_amount+$3 WHERE draw_month=$4`,
      [amount, charityShare, distributable, month],
    );
  } else {
    await pool.query(
      `INSERT INTO prize_pool (draw_month, total_amount, charity_amount, distributable_amount) VALUES ($1,$2,$3,$4)`,
      [month, amount, charityShare, distributable],
    );
  }
};

const getSubscriptionStatus = async (userId) => {
  const result = await pool.query(
    `SELECT status, plan, start_date, end_date, stripe_subscription_id
     FROM subscriptions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1`,
    [userId],
  );
  if (result.rows.length === 0) return { status: "inactive" };
  return result.rows[0];
};

const activateBySessionId = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") throw new Error("Session not paid");
  await activateSubscription(session);
  return true;
};

module.exports = {
  createCheckoutSession,
  activateSubscription,
  cancelSubscription,
  deactivateSubscription,
  checkActiveSubscription,
  getSubscriptionStatus,
  activateBySessionId,
};
