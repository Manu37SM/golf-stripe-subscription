const userService = require("./user.service");

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProfile,
};
