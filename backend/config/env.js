const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  price: process.env.STRIPE_PRICE_ID,
  yearlyPrice: process.env.STRIPE_YEARLY_PRICE_ID,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};
