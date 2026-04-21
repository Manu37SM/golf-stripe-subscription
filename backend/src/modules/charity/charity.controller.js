const charityService = require('./charity.service');

const getCharities = async (req, res) => {
  try {
    const data = await charityService.getCharities();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const selectCharity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { charityId, percentage } = req.body;

    const result = await charityService.selectCharity(
      userId,
      charityId,
      percentage
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUserCharity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await charityService.getUserCharity(userId);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCharities,
  selectCharity,
  getUserCharity,
};