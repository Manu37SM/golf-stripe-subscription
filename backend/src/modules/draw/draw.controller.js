const drawService = require("./draw.service");

const createDraw = async (req, res) => {
  try {
    const { month } = req.body;
    if (!month) return res.status(400).json({ error: "Month is required (YYYY-MM)" });
    const draw = await drawService.createDraw(month);
    res.status(201).json(draw);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const runDraw = async (req, res) => {
  try {
    const { id } = req.params;
    const winners = await drawService.runDraw(id);
    res.status(200).json({ message: "Draw executed", winners });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const simulateDraw = async (req, res) => {
  try {
    const { id } = req.params;
    const preview = await drawService.simulateDraw(id);
    res.status(200).json(preview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const publishDraw = async (req, res) => {
  try {
    const { id } = req.params;
    const draw = await drawService.publishDraw(id);
    res.status(200).json({ message: "Draw published", draw });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllDraws = async (req, res) => {
  try {
    const draws = await drawService.getAllDraws();
    res.status(200).json(draws);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createDraw, runDraw, simulateDraw, publishDraw, getAllDraws };
