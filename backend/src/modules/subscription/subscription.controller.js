const subscriptionService = require("./subscription.service");

const createSession = async (req, res) => {
  try {
    const url = await subscriptionService.createCheckoutSession(
      req.user.userId,
      req.body.plan,
    );
    res.status(200).json({ url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getStatus = async (req, res) => {
  try {
    res
      .status(200)
      .json(await subscriptionService.getSubscriptionStatus(req.user.userId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const activateSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId)
      return res.status(400).json({ error: "sessionId required" });
    await subscriptionService.activateBySessionId(sessionId);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    await subscriptionService.cancelSubscription(req.user.userId);
    res.status(200).json({ message: "Subscription cancelled successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createSession,
  getStatus,
  activateSession,
  cancelSubscription,
};
