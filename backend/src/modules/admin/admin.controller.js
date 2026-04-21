const adminService = require("./admin.service");

const getUsers = async (req, res) => {
  try { res.status(200).json(await adminService.getAllUsers()); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

const updateUserRole = async (req, res) => {
  try {
    const updated = await adminService.updateUserRole(req.params.id, req.body.role);
    res.status(200).json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

const createCharity = async (req, res) => {
  try { res.status(201).json(await adminService.createCharity(req.body)); }
  catch (err) { res.status(400).json({ error: err.message }); }
};

const updateCharity = async (req, res) => {
  try { res.status(200).json(await adminService.updateCharity(req.params.id, req.body)); }
  catch (err) { res.status(400).json({ error: err.message }); }
};

const deleteCharity = async (req, res) => {
  try { await adminService.deleteCharity(req.params.id); res.status(200).json({ message: "Deleted" }); }
  catch (err) { res.status(400).json({ error: err.message }); }
};

const getWinners = async (req, res) => {
  try { res.status(200).json(await adminService.getAllWinners()); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

const updateWinner = async (req, res) => {
  try {
    const updated = await adminService.updateWinnerStatus(req.params.id, req.body.status);
    res.status(200).json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

const getReports = async (req, res) => {
  try { res.status(200).json(await adminService.getReports()); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

const seedData = async (req, res) => {
  try {
    const result = await adminService.seedCharities();
    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getUsers, updateUserRole, createCharity, updateCharity, deleteCharity, getWinners, updateWinner, getReports, seedData };
