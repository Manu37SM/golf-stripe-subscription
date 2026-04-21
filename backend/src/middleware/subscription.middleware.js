const subscriptionService = require("../modules/subscription/subscription.service");

const checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const isActive = await subscriptionService.checkActiveSubscription(userId);

    if (!isActive) {
      return res.status(403).json({
        error: "Active subscription required",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = checkSubscription;
