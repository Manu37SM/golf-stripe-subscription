const stripe = require("../../../config/stripe");
const subscriptionService = require("./subscription.service");

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // req.body here is a raw Buffer because this route is registered
    // before express.json() in app.js — this is intentional and required
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Stripe webhook event:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // Only activate if payment is confirmed (not just session opened)
        if (session.payment_status === "paid") {
          await subscriptionService.activateSubscription(session);
          console.log("Subscription activated for userId:", session.metadata?.userId);
        }
        break;
      }

      // Handle subscription cancellation / expiry
      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        if (subscription.status === "canceled" || subscription.status === "unpaid") {
          await subscriptionService.deactivateSubscription(subscription.id);
          console.log("Subscription deactivated:", subscription.id);
        }
        break;
      }

      default:
        // Ignore other events
        break;
    }
  } catch (err) {
    console.error("Error handling webhook event:", err.message);
    // Still return 200 to Stripe so it doesn't retry endlessly
    return res.status(200).json({ received: true, error: err.message });
  }

  res.json({ received: true });
};

module.exports = handleWebhook;
