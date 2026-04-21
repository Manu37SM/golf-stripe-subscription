const express = require("express");
const router = express.Router();
const scoreController = require("./score.controller");
const verifyToken = require("../../middleware/auth.middleware");
const checkSubscription = require("../../middleware/subscription.middleware");
const validateScore = require("./score.validation");

// All score routes require auth + active subscription
router.post("/", verifyToken, checkSubscription, validateScore, scoreController.addScore);
router.get("/", verifyToken, checkSubscription, scoreController.getScores);
router.put("/:id", verifyToken, checkSubscription, validateScore, scoreController.updateScore);
router.delete("/:id", verifyToken, checkSubscription, scoreController.deleteScore);

module.exports = router;
