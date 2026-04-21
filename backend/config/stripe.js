const Stripe = require("stripe");
const config = require("./env");

const stripe = new Stripe(config.stripeSecret);

module.exports = stripe;
